import type { INPUT_TYPES } from '@/constants/form';
import type { ComponentInternalInstance, Ref, ShallowRef } from 'vue';

export enum INPUT_EVENT_TYPES {
    BLUR_INPUT = 'onBlurThenOnInput',
    INPUT = 'onInput',
    BLUR = 'onBlur',
}

export type TFormInputValue = string | number;

export type TTransProxy = (value: string, ...args: never) => string;

export interface IFormInputValidator {
    validator: string | ((value: TFormInputValue, ...args: never) => boolean)
    message?: string
}

export interface IFormValidatorOptions {
    validators?: Array<IFormInputValidator>,
    event?: INPUT_EVENT_TYPES,
}

export interface IInputTextarea {
    autocomplete?: string
    autofocus?: boolean
    disabled?: boolean
    id?: string
    name?: string
    placeholder?: string
    readonly?: boolean
    required?: boolean
    rows?: number | string
    value?: string
    type?: INPUT_TYPES
    validatorEvent?: string
    validators?: Array<IFormInputValidator>
}

export interface IInputCheckbox {
    name?: string
    id?: string
    value: string | boolean | null
    readonly?: boolean
    label?: string
    disabled?: boolean
    required?: boolean
    trueValue?: string
    falseValue?: string
    autocomplete?: string
    validatorEvent?: string
    validators?: Array<IFormInputValidator>
}

export interface IInput extends IInputTextarea {
    label?: string
    validatorEvent?: string
    accept?: string
    multiple?: boolean
    pattern?: string
    step?: number | string
    max?: number | string
    min?: number | string
}

export interface IMxFormHandler {
    activeItems: ShallowRef<Array<ComponentInternalInstance>>
    errors: Ref<Record<string, Array<string>>>
    clear: (groupName: string) => void,
    validate: (groupName: string, functionName?: string) => boolean,
    hasErrors: (groupName: string) => boolean,
    getErrors: (groupName: string) => Array<string>,
}
