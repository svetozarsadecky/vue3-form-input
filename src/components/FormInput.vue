<script lang="ts">
export default {
    name: 'FormInput',
};
</script>

<template>
    <div :class="rootClasses">
        <div :class="elementClassName.field">
            <div
                v-if="hasSlotPrepend"
                :class="elementClassName.prepend"
                :data-test="elementClassName.prepend"
            >
                <slot
                    name="prepend"
                ></slot>
            </div>

            <label
                :for="input.id"
                :class="elementClassName.wrapper"
            >
                <span
                    v-if="showHider"
                    :class="elementClassName.hider"
                ></span>
                <textarea
                    v-if="isTextArea"
                    :id="input.id"
                    ref="refInput"
                    v-model="localValue"
                    :autocomplete="autocomplete"
                    :class="inputClassName"
                    :name="input.name"
                    :placeholder="translate(input.placeholder)"
                    :readonly="isReadonly"
                    :required="isRequired"
                    :disabled="isDisabled"
                    :autofocus="input.autofocus"
                    :rows="input.rows"
                    v-bind="bindAttrsInput"
                    data-test="form-input__input"
                    @blur="onBlur"
                    @focus="onFocus"
                    @input="onInput"
                    @keydown="onKeydown"
                    @keyup="onKeyup"
                ></textarea>

                <input
                    v-else
                    :id="input.id"
                    ref="refInput"
                    v-model="localValue"
                    :accept="input.accept"
                    :autocomplete="autocomplete"
                    :class="inputClassName"
                    :multiple="input.multiple"
                    :name="input.name"
                    :pattern="input.pattern"
                    :step="input.step"
                    :min="input.min"
                    :max="input.max"
                    :placeholder="translate(input.placeholder)"
                    :readonly="isReadonly"
                    :disabled="isDisabled"
                    :required="isRequired"
                    :autofocus="input.autofocus"
                    :type="type"
                    data-test="form-input__input"
                    v-bind="bindAttrsInput"
                    @blur="onBlur"
                    @focus="onFocus"
                    @input="onInput"
                    @keydown="onKeydown"
                    @keyup="onKeyup"
                >

                <span
                    v-if="hasSlotLabel"
                    class=""
                    :class="elementClassName.label"
                    :data-test="elementClassName.label"
                >
                    <slot name="label">
                        {{ translate(input.label) }}
                    </slot>
                </span>
            </label>

            <div
                v-if="hasSlotSuffix"
                :class="elementClassName.suffix"
                :data-test="elementClassName.suffix"
            >
                <slot
                    name="suffix"
                    :is-state-visible="showState"
                ></slot>
            </div>

            <div
                v-if="hasSlotAppend"
                :class="elementClassName.append"
                :data-test="elementClassName.append"
            >
                <slot
                    name="append"
                    :errors="errors"
                >
                </slot>
            </div>
        </div>

        <div
            v-if="hasSlotMessage"
            class="form-input__message text-secondary mt-1"
            :class="elementClassName.message"
            :data-test="elementClassName.message"
        >
            <slot name="message"></slot>
        </div>

        <div v-if="showState">
            <FormErrors
                :errors="errors"
                data-test="form-input__errors"
            ></FormErrors>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {
    ref,
    withDefaults,
    computed,
    watch,
    onMounted,
    onBeforeUnmount,
    useSlots,
    reactive,
} from 'vue';
import { INPUT_TYPES } from '@/constants/form';
import { generateElementClassNames, getClassName } from '@/helpers';
import FormErrors from '@/components/FormErrors.vue';
import type {
    IInput,
    TFormInputValue,
} from '@/types';
import FormItem from '@/mixins/FormItem';
import FormItemValidator from '@/mixins/FormItemValidator';
import FormItemInstaller from '@/mixins/FormItemInstaller';


// TODO: Add alternative non floating prop for input.
//  So label can coexist with placeholder
interface Props {
    className?: string | null
    bindAttrsInput?: Record<string, IInput> | null
    groupName?: string
    input: IInput
    formErrors?: Array<string>
    modelValue?: TFormInputValue
    inputClass?: string
    // TODO: Needs maybe more specific typing
    trans?: ((...args: any) => string)
    type?: INPUT_TYPES
}

interface Emits {
    (e: 'blur', event: Event): void
    (e: 'focus', event: Event): void
    (e: 'eager', event: Event): void
    (e: 'keydown', event: Event): void
    (e: 'keyup', event: Event): void
    (e: 'update:modelValue', value: TFormInputValue): void
}

/**
 * Reactive Data
 */
const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
    className: null,
    groupName: '',
    formErrors: () => ([]),
    modelValue: '',
    inputClass: '',
    type: undefined,
    trans: undefined,
    bindAttrsInput: null,
});
const {
    label,
    message,
    append,
    suffix,
    prepend,
} = useSlots();
const localValue = ref<TFormInputValue>(
    !props.modelValue
        ? ''
        : props.modelValue
);
const refInput = ref<HTMLInputElement | null>(null);
const clearCalled = ref<boolean>(false);

/**
 * Computed
 */
const isFilled = computed<boolean>(() => `${localValue.value}`.length > 0);
const isTextArea = computed<boolean>(() => props.input.type === INPUT_TYPES.TEXTAREA);
const showHider = computed(() => isTextArea.value && props.input.label);
const autocomplete = computed(() => props.input.autocomplete || 'off');

// Computed Slots
const hasSlotLabel = computed<boolean>(() => !!props.input.label || (!!label && label().length > 0));
const hasSlotMessage = computed<boolean>(() => !!message && message().length > 0);
const hasSlotSuffix = computed<boolean>(() => !!suffix && suffix().length > 0);
const hasSlotAppend = computed<boolean>(() => !!append && append().length > 0);
const hasSlotPrepend = computed<boolean>(() => !!prepend && prepend().length > 0);

// Extend with FormItem general settings
const {
    className,
    inputClassName,

    type,

    isHidden,
    isReadonly,
    isDisabled,
    isRequired,
} = FormItem(
    localValue,
    props,
    'form-input',
);

// Extend with FormItemInstaller to add lifecycle hooks
const {
    onItemMounted,
    onItemBeforeUnmount,
} = FormItemInstaller();

// Extend with FormItemValidator to add validator logic
const {
    Validator,
    errors,
    showState,
    hasErrors,
    validate,
    setState,
} = FormItemValidator(
    props,
    localValue,
    refInput
);

// Computed classes
const rootClasses = computed<Record<string, boolean>>(() => ({
    [getClassName(className.value)]: true,
    [getClassName(className.value, null, 'is-filled')]: isFilled.value,
    [getClassName(className.value, null, 'has-error')]: hasErrors.value,
    [getClassName(className.value, null, 'has-no-label')]: !hasSlotLabel.value,
    [getClassName(className.value, null, 'is-required')]: isRequired.value,
    [getClassName(className.value, null, 'is-readonly')]: isReadonly.value,
    [getClassName(className.value, null, 'is-hidden')]: isHidden.value,
    [getClassName(className.value, null, 'is-disabled')]: isDisabled.value,
    [getClassName(className.value, null, 'is-valid')]: showState.value && !hasErrors.value,
    [getClassName(className.value, null, 'textarea')]: isTextArea.value,
}));
const elementClassName = reactive(generateElementClassNames(
    className.value,
    [
        'append',
        'prepend',
        'suffix',
        'field',
        'hider',
        'label',
        'wrapper',
        'message',
    ]
));

/**
 * Watchers
 */
watch(
    () => props.modelValue,
    (value) => {
        localValue.value = !value
            ? ''
            : value;

        /**
         * When value change hide errors.
         * and validate by validator type
         * @type {boolean}
         */
        if (clearCalled.value) {
            return;
        }

        Validator.validateByEventType(localValue.value, 'input', setState);
        clearCalled.value = false;
    }
);

watch(
    () => props.formErrors,
    (value: Record<string, string> | Array<string>) => {
        if (value && Object.keys(value.length > 0)) {
            setState();
            errors.value = props.formErrors;
        }
    },
);

// Events
function onFocus(event: Event): void {
    emit('focus', event);
}

function onBlur(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;

    if (target && ('value' in target)) {
        target.value = String(localValue.value);
    }

    Validator.validateByEventType(localValue.value, event.type, setState);
    emit('blur', event);
}

function onInput(event: Event): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;

    Validator.validateByEventType(localValue.value, event.type, setState);
    emit('eager', event);

    if (target && ('value' in target)) {
        emit('update:modelValue', target.value);
    }
}

function onKeydown(event: Event): void {
    emit('keydown', event);
}

function onKeyup(event: Event): void {
    emit('keyup', event);
}

// Methods
function translate(key: string): string {
    if (typeof props.trans === 'function') {
        return props.trans(key);
    }

    return key;
}

function clear(): void {
    clearCalled.value = true;
    localValue.value = '';

    emit('update:modelValue', localValue.value);

    errors.value = [];
    showState.value = false;
}


/**
 * Lifecycle hooks subscribing/unsubscribing from active Form items
 */
onMounted(() => {
    onItemMounted();
});

onBeforeUnmount(() => {
    onItemBeforeUnmount();
});

defineExpose({
    clear,
    groupName: props.groupName,
    formErrors: errors,
    validate,
});
</script>

<style lang="scss">
@import "@/scss/form-input";
</style>
