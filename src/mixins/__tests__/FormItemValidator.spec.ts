import { describe, expect, it } from 'vitest';
import { type Ref, ref } from 'vue';
import { INPUT_TYPES } from '@/constants/form';
import FormItemValidator from '@/mixins/FormItemValidator';

const input = {
    id: 'full-email',
    type: INPUT_TYPES.EMAIL,
    name: 'email',
    required: true,
    readonly: false,
    accept: '', // Just for input type 'file'
    rows: 0, // Just for input type 'textarea'
    autocomplete: 'username email',
    label: 'E-mail',
    pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
    value: '',
    validators: [
        {
            validator: 'email',
        },
        {
            validator: 'required',
        },
    ],
    validatorEvent: 'onBlur',
};

const factory = (
    value = '',
    propsArg: Record<string, any> | null,
    element?: Ref<HTMLElement>,
) => {
    const localValue = ref(value);
    const props = {
        input,
        inputClass: '',
        formErrors: ([]),
        className: 'form-input',
    };

    return FormItemValidator(
    { ...props, ...propsArg },
        localValue,
        element
    );
};

describe('FormItem service', () => {
    it('generates basic form item validator setup', () => {
        const wrapper = factory('', null);

        /* eslint-disable no-useless-escape */
        expect(wrapper.Validator).toMatchInlineSnapshot(`
          FormValidator {
            "\$el": undefined,
            "errors": RefImpl {
              "__v_isRef": true,
              "__v_isShallow": false,
              "_rawValue": [],
              "_value": [],
              "dep": undefined,
            },
            "options": {
              "event": "onBlur",
              "validators": [
                {
                  "validator": "email",
                },
                {
                  "validator": "required",
                },
              ],
            },
            "trans": [Function],
          }
        `);

        expect(wrapper.validatorEvent.value).toMatchInlineSnapshot('"onBlur"');
        expect(wrapper.errors.value).toMatchInlineSnapshot('[]');
        expect(wrapper.showState.value).toMatchInlineSnapshot('false');
        expect(wrapper.hasErrors.value).toMatchInlineSnapshot('false');
    });

    it('generates setup with errors', () => {
        const wrapper = factory('', null);
        wrapper.errors.value.push('error1');

        expect(wrapper.Validator.errors.value).toMatchInlineSnapshot(`
          [
            "error1",
          ]
        `);
        expect(wrapper.errors.value).toMatchInlineSnapshot(`
          [
            "error1",
          ]
        `);
        expect(wrapper.showState.value).toMatchInlineSnapshot('false');
        expect(wrapper.hasErrors.value).toMatchInlineSnapshot('true');
    });
});
