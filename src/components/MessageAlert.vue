<template>
    <teleport to='#message'>
        <div class="alert message-info fixed-top w-50 mx-auto d-flex justify-content-between mt-2"
          :class="classObject" v-if="isVisible"
        >
        <span>{{message}}</span>
        <button type="button" class="close" aria-label="Close" @click.prevent="hide">
            <span aria-hidden="true">&times;</span>
        </button>
        </div>
    </teleport>
</template>

<script lang="ts">
import { defineComponent, PropType, ref} from 'vue'
import useDomCreate from '../hooks/useDOMCreate'
export type MessageType = 'success' | 'error' | 'default'
export default defineComponent({
    props: {
        message: String,
        type: {
            type: String as PropType<MessageType>,
            default: 'default'
        }
    },
    emits:['close-message'],
    setup(props,context){
        useDomCreate('message')
        const isVisible = ref(true)
        const classObject = {
            'alrt-success': props.type == 'success',
            'alert-danger': props.type == 'error',
            'alert-promary': props.type == 'default',
        }
        const hide = () => {
            isVisible.value = false
            context.emit('close-message',true)
        }
        return{
            classObject,
            hide,
            isVisible
        }
    }
})
</script>

<style lang="">
    
</style>