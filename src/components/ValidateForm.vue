<template>
    <form class="validate-form-container">
        <slot></slot>
        <div class="submit-area" @click.prevent="submitForm">
            <slot name="submit">
                <button type="submit" class="btn btn-primary">
                    提交
                </button>
            </slot>
        </div>
    </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
export const emitter = mitt()
type ValidateFunc = () => boolean
export default defineComponent({
    emits: ['form-submit'],
    setup(props,context) {
        let funcArr:ValidateFunc[] = []
        const submitForm = () => {
            const result = funcArr.map(func => func()).every(result => result)
            context.emit('form-submit', result)
            
        }
        const callback = (func: ValidateFunc | undefined) => {
            funcArr.push(func as ValidateFunc)
        }
        emitter.on('form-item-created', callback)
        onUnmounted(() => {
            emitter.off('form-item-created', callback)
            funcArr = []
        })
        return {
            submitForm,
        }
    }
    
})
</script>