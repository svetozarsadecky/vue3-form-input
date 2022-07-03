import { INPUT_TYPES } from '@/constants/form';

export const FORM_INPUT_FULL = {
    id: 'full-email',
    type: INPUT_TYPES.EMAIL,
    name: 'email',
    required: false,
    readonly: false,
    // placeholder: 'example@odyzeo.com',
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
