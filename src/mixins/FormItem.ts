import {
    computed,
} from 'vue';
import { INPUT_TYPES } from '@/constants/form';
import { getClassName } from '@/helpers';
import type { Ref } from 'vue';
import type { IInput, IInputCheckbox, TFormInputValue } from '@/types/form';

export interface Props {
    input: IInput | IInputCheckbox,
    formErrors: Array<string>,
    className?: string | null,
    inputClass?: string,
    trans?: ((...args: any) => string),
}
/**
 * FormItem factory
 *
 * This defines most of the attributes and methods that
 * are used throughout form items (i.e. input, select, radio)
 * @param value
 * @param props
 * @param classNameArg
 */
export default function (
    value: Ref<TFormInputValue>,
    props: Props,
    classNameArg: string,
) {
    // Classes
    const className = computed<string>(() => props.className ?? classNameArg);
    const inputClassName = computed(() => ([
        props.inputClass,
        getClassName(className.value, 'input'),
    ]));
    const rootClasses = computed<Record<string, boolean>>(() => ({
        [getClassName(className.value)]: true,
        [getClassName(className.value, null, 'is-required')]: isRequired.value,
        [getClassName(className.value, null, 'is-readonly')]: isReadonly.value,
        [getClassName(className.value, null, 'is-hidden')]: isHidden.value,
        [getClassName(className.value, null, 'is-disabled')]: isDisabled.value,
    }));

    // Computed states
    const type = computed<INPUT_TYPES>(() => 'type' in props.input
        && props.input.type
        || INPUT_TYPES.TEXT);
    const isHidden = computed<boolean>(() => type.value === INPUT_TYPES.HIDDEN);
    const isReadonly = computed<boolean>(() => !!props.input.readonly);
    const isDisabled = computed<boolean>(() => !!props.input.disabled);
    const isRequired = computed<boolean>(() => !!props.input.required);

    return {
        rootClasses,
        className,
        inputClassName,
        type,

        isHidden,
        isReadonly,
        isDisabled,
        isRequired,
    };
}
