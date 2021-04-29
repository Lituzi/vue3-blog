<template>
 <validate-form @form-submit="onFormsubmit">
        <div class="mb-3">
            <label class="form-label">邮箱地址</label>
            <validate-input 
              :rules="emailRules" v-model="emailVal"
              type="text"
              placeholder="请输入邮箱地址"
              ref="inputRef"
            >
            </validate-input>
        </div>
        <div class="mb-3">
            <label class="form-label">邮箱地址</label>
            <validate-input 
            :rules="passwordRules" v-model="passwordVal"
            type="password"
            placeholder="请输入密码"
            >
            </validate-input>
        </div>
        <template v-slot:submit>
            <span class="btn btn-primary btn-block btn-large">Submit</span>
        </template>
    </validate-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import {useStore} from 'vuex'
import { UserProps } from '../testData'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import createMessage from '@/components/createMessage'
const currentUser: UserProps = {
    isLogin: true,
    name: 'tuzikou'
}
export default defineComponent({
    components:{
        ValidateInput,
        ValidateForm
    },
    setup () {
      const store = useStore()
      const emailVal = ref('')
      const inputRef = ref<any>()
      const router = useRouter()
      const emailRules:RulesProp = [
          {type:'required', message: '电子邮箱地址不能为空'},
          {type: 'email', message: '请输入正确的电子邮箱格式'}
      ]
      const passwordRules:RulesProp = [
          {type:'required', message: '密码不能为空'},
      ]
      const passwordVal = ref('')
      const onFormsubmit = (result:boolean) => {
          if(result) {
              const payload = {
                  email:emailVal.value,
                  password: passwordVal.value
              }
            //   store.dispatch('loginAndFetch',payload).then(data => {
            //       createMessage('登录成功 2s后跳转首页', 'success')
            //       setTimeout(() => {
            //           router.push('/')
            //       }, 2000)
            //   }).catch( e => {
            //       console.log(e)
            //   })
              router.push('/')
              store.commit('login')
          }
      }
      return{
        emailRules,
        passwordRules,
        currentUser,
        emailVal,
        passwordVal,
        onFormsubmit,
      }

    
  }
})
</script>
