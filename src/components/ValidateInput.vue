<template>
    <div class="validate-input-container pb-3">
        <input 
            v-if="tag != 'textarea' "
            class="form-control" id="exampleInputEmail1" 
            :class="{'is-invalid': inputRef.error}"
            @blur="validateInput"
            v-model="inputRef.val"
            v-bind="$attrs"
        />
        <textarea
            v-else
            class="form-control" id="exampleInputEmail1" 
            :class="{'is-invalid': inputRef.error}"
            v-model="inputRef.val"
            @blur="validateInput"
            v-bind="$attrs"
        />
        <span v-if="inputRef.error" class="invalid-feedback">{{inputRef.message}}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, onMounted, watch, computed} from 'vue'
import {emitter} from './ValidateForm.vue'
const emailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
interface RuleProp {
    type: 'required' | 'email' | 'custom';
    message: string;
    validator?: () => boolean;
}
export type RulesProp = RuleProp[]
export type TagType = 'input' | 'textarea'
export default defineComponent({
    props: {
        rules: Array as PropType<RulesProp>,
        modelValue: String,
        tag:{
            type: String as PropType<TagType>,
            default: 'input'
        }
    },
    inheritAttrs: false,
    setup(props,context){
        const inputRef = reactive({
            val: computed({
                get: () => props.modelValue || '',
                set: val => {
                    context.emit('update:modelValue',val)
                }
            }),
            error: false,
            message: ''
        })
        const validateInput = () => {
            if(props.rules){
                const allPassed = props.rules.every(rule => {
                    let passed = true
                    inputRef.message = rule.message
                    switch(rule.type){
                        case 'required':
                            passed = (inputRef.val.trim() !== '')
                            break
                        case 'email':
                            passed = emailReg.test(inputRef.val)
                            break
                        case 'custom':
                            passed = rule.validator ? rule.validator() : true
                        default:
                            break
                    }
                    return passed
                })
                inputRef.error = !allPassed
                return allPassed
            }

        }
        onMounted(() => {
            emitter.emit('form-item-created', validateInput)
        })
        return {
            inputRef, 
            validateInput,
        }

    }
})
</script>