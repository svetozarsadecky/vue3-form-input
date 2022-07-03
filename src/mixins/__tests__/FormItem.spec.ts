import { describe, expect, it } from 'vitest';
import FormItem from '@/mixins/FormItem';
import { ref } from 'vue';
import { INPUT_TYPES } from '@/constants/form';

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
    classNameArg = ''
) => {
    const localValue = ref(value);
    const props = {
        input,
        formErrors: ([]),
        className: 'form-input',
        inputClass: '',
    };

    return FormItem(
        localValue,
        { ...props, ...propsArg },
        classNameArg,
    );
};

describe('FormItem service', () => {
    it('generates basic form item setup', () => {
        const formItem = factory('', null);

        /* eslint-disable no-useless-escape */
        expect(formItem.className.value).toMatchInlineSnapshot('"form-input"');
        expect(formItem.inputClassName.value).toMatchInlineSnapshot(`
          [
            "",
            "form-input__input",
          ]
        `);
        expect(formItem.rootClasses.value).toMatchInlineSnapshot(`
          {
            "form-input": true,
            "form-input--is-disabled": false,
            "form-input--is-hidden": false,
            "form-input--is-readonly": false,
            "form-input--is-required": true,
          }
        `);
        expect(formItem.type.value).toMatchInlineSnapshot('"email"');
        expect(formItem.isHidden.value).toMatchInlineSnapshot('false');
        expect(formItem.isDisabled.value).toMatchInlineSnapshot('false');
        expect(formItem.isReadonly.value).toMatchInlineSnapshot('false');
        expect(formItem.isRequired.value).toMatchInlineSnapshot('true');
    });

    it('generates form item setup with rootClasses', () => {
        const props: Record<string, any> = {
            input,
            className: 'form-input',
        };
        const formItem = factory('value', props);

        expect(formItem.rootClasses.value).toMatchInlineSnapshot(`
          {
            "form-input": true,
            "form-input--is-disabled": false,
            "form-input--is-hidden": false,
            "form-input--is-readonly": false,
            "form-input--is-required": true,
          }
        `);
    });
});
