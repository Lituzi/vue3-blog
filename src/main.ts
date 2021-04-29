import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'


axios.defaults.baseURL = 'http://api.vikingship.xyz/api/'
axios.get('columns').then(resp => {
  console.log(resp.data)
})
axios.interceptors.request.use(config => {
  store.commit('setLoading', true)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)

})
axios.interceptors.response.use(config => {
  store.commit('setLoading',false)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)

})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
