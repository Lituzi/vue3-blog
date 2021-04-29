import { createStore, Commit } from 'vuex'
import axios, {AxiosRequestConfig} from 'axios'
export interface ResponseType<P> {
  code: number;
  msg: string;
  data: P;
}
import { testData, testPosts, PostProps} from './testData'
interface UserProps {
  isLogin: boolean;
  name?: string;
  id?: string;
  columnId?: number;
}
export interface ImageProps {
  _id?: string;
  url?: string;
  createdAt?: string;
  fitUrl?: string;
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;

}
export interface GlobalDataProps {
  columns: ColumnProps[];
  posts: PostProps[];
  user: UserProps;
  loading: boolean;
  token: string;
  error: GlobalErrorProps;
}
// interface ImageProps {
//   _id?: string;
//   url?: string;
//   createdAt?: string;
// }
export interface ColumnProps {
  id: number;
  title: string;
  avatar?: string | ImageProps;
  description: string;
}
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
  const { data } = await axios.get(url);
  commit(mutationName, data)
  return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payload:any) => {
  const { data } = await axios.post(url,payload);
  commit(mutationName, data)
  return data
}
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = {method:'get'}) => {
  const { data } = await axios(url, config)
  commit(mutationName, data)
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    columns: testData,
    posts: testPosts,
    user: { isLogin: false, name: 'tuzikou', columnId: 1 },
    loading: false,
    token: localStorage.getItem('token') || '',
    error: { status: false },
    // posts: { data: {}, loadedColumns: [] },
  },
  mutations: {
    login(state) {
      state.user = { ...state.user, isLogin: true, name: 'tuzikou', columnId:1 }
    },
    createPost(state, newPost) {
      state.posts.push(newPost)
    },
    fetchColumns(state, rawData) {
      state.columns = rawData.data.list
    },
    fetchColumn(state, rawData) {
      state.columns = [rawData.data]
    },
    fetchPosts(state, rawData) {
      state.posts = rawData.data.list
    },
    setLoading(state, status) {
      state.loading = status
    },
    login1(state, rawData) {
      state.token = rawData.data
      localStorage.setItem('token',rawData.data)
      axios.defaults.headers.common['Authorization'] = `Bearer ${rawData.data}`
    },
    fetchCurrentUser(state, rawData) {
      state.user = {isLogin:true, ...rawData.data}
    },
    updatePost(state, { data }) {
      state.posts = state.posts.map(post => {
        if (post.id == data.id) {
          return data
        } else {
          return post
        }
      })
    },
    setError(state, e: GlobalErrorProps) {
      state.error = e
    },
    logout(state) {
      state.token = ''
      localStorage.remove('token')
      delete axios.defaults.headers.common
    }
  },
  actions: {
    fetchColumns({commit}) {
      return getAndCommit('./columns','fetchColumns',commit)
    },
    fetchColumn({ commit }, cid) {
      return getAndCommit(`./columns/${cid}`,'fetchColumn',commit)
    },
    fetchPosts({ commit }, cid) {
      return getAndCommit(`./columns/${cid}/posts`,'fetchPosts',commit)
    },
    login({ commit }, payload) {
      return postAndCommit('/user/login','login1',commit,payload)
    },
    fetchCurrentUser({ commit }) {
      return getAndCommit('user/current','fetchCurrentUser',commit)
    },
    loginandFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    },
    updatePost({ commit }, { id, payload }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payload
      })
    },
    createPost({ commit }, payload) {
      return getAndCommit('/posts', 'createPost', commit)
    },
    deletePost({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, { method: 'delete' })
    },
    fetchPost({ state, commit }, id) {
      // const currentPost = state.posts.data[0]
      // if (!currentPost || !currentPost.content) {
      //   return getAndCommit(`/posts/${id}`, 'fetchPost', commit)
      // } else {
      //   return Promise.resolve({ data: currentPost })
      // }
    },
  },
  getters: {
    getColumnById: (state) => (id: number) => {
      return state.columns.find(c => c.id == id)
    },
    getPostsByCid: (state) => (cid: number) => {
      return state.posts.filter(post => post.columnId == cid)
    },
    getCurrentPost: (state) => (id: string) => {
      // return state.posts.data[id]
    }
  }
  
})

export default store