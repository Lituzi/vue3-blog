<template>
  <div class="container">
    <global-header :user="currentUser"></global-header>
    <!-- <loader text="拼命加载中" background="rgba(0,0,0,0.8)"
            v-if="isLoading"></loader> -->
    <router-view></router-view>
    <footer class="text-center py-4 text-secondary bg-light mt-6">
        <small>
            <ul class="list-inline mb-0">
                <li class="list-inline-item">@ 2021 tuzikou</li>
                <li class="list-inline-item">@ 文档</li>
                <li class="list-inline-item">@ 资源</li>
                <li class="list-inline-item">@ 联系</li>
                <li class="list-inline-item">@ 更多</li>
            </ul>
        </small>
    </footer>
    
   


        
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, watch } from 'vue'
import { useStore } from 'vuex'
import 'bootstrap/dist/css/bootstrap.min.css'
import ColumnList from './components/ColumnList.vue'
import { ColumnProps } from './testData'
import GlobalHeader from './components/GobalHeader.vue'
import { UserProps } from './testData'
import ValidateInput, {RulesProp} from './components/ValidateInput.vue'
import ValidateForm from './components/ValidateForm.vue'
import Loader from './components/Loader.vue'
import createMessage from './components/createMessage'
import Uploader from './components/Uploader.vue'


export default defineComponent({
  name: 'App',
  components: {
    ColumnList,
    GlobalHeader,
    ValidateInput,
    ValidateForm,
    Loader,

  },
  setup () {
      const store = useStore()
      const currentUser = computed(() => store.state.user)
      const isLoading = computed(() => store.state.loading)
      console.log(isLoading)
      const error = computed(() => store.state.error)
      watch(() => error.value.status, () => {
          const {status, message} = error.value
          if(status && message){
              createMessage(message,'error')
          }
      })
      return{
          currentUser,
          error,
          isLoading
      }

    
  }
})
</script>
