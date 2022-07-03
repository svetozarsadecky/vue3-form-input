import { computed, ref } from 'vue';
import type { Ref } from 'vue';
import type { Props } from '@/mixins/FormItem';
import { FormValidator } from '@/services';

export default function (
    props: Props,
    /* eslint-disable @typescript-eslint/no-explicit-any */
    value: any,
    element?: Ref<any>,
    /* eslint-enable @typescript-eslint/no-explicit-any */
) {
    const showState = ref<boolean>(false);
    const errors = ref<Array<string>>([]);
    const validatorEvent = computed(() => props.input.validatorEvent || 'none');
    const Validator = new FormValidator(
        {
            validators: [ ...(props.input.validators || []) ],
            event: validatorEvent.value,
        },
        errors,
        props.trans,
        element
    );
    const hasErrors = computed<boolean>(() => !!errors.value.length);

    /**
     * Change showState to 'true' value so that
     * state of validation can be shown
     */
    function setState(): void {
        showState.value = true;
    }

    /**
     * Validate value using Validator class and update errors ref object
     */
    function validate(): void {
        if (!props.input.validators) {
            return;
        }

        Validator.validate(value.value);
        showState.value = true;
    }

    /**
     * This is a placeholder method that should be replaced inside
     * specific component (as it lacks emitter)
     */
    function clear(): void {
        // Emit value upward
        // emit('update:modelValue', value.value);
        //
        // errors.value = [];
        // showState.value = false;
    }

    return {
        Validator,
        validatorEvent,
        errors,
        showState,
        hasErrors,
        clear,
        validate,
        setState,
    };
}
