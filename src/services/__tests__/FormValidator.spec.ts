import { describe, expect, it, vi } from 'vitest';
import { FormValidator } from '@/services';
import { ref } from 'vue';
import type { Ref } from 'vue';
import type { TTransProxy } from '@/types/form';
import type { IFormValidatorOptions } from '@/types/form';
import { INPUT_EVENT_TYPES } from '@/types/form';

const options = {
    validators: [
        {
            validator: 'email',
        },
        {
            validator: 'required',
        },
    ],
    event: 'onBlur',
};
const CORRECT_EMAIL = 'emailName@domain.com';
const INCORRECT_EMAIL = 'emailName';

interface FormValidatorConfig {
    errors?: Ref<Array<string>>
    options?: IFormValidatorOptions
    trans?: TTransProxy
    $el?: Ref<HTMLInputElement | null>
}

const factory = (config: FormValidatorConfig) => {
    const errorsValue = config.errors || ref([]);
    const configOptions = { ...options, ...config.options };

    return new FormValidator(
        configOptions,
        errorsValue,
        (value: string) => value,
        config.$el
    );
};

describe('FormValidator service', () => {
    it('creates basic validator instance', () => {
        const errors = ref([]);
        const validator = factory({
            errors,
        });

        /* eslint-disable no-useless-escape */
        expect(validator).toMatchInlineSnapshot(`
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
        /* eslint-enable no-useless-escape */
    });

    it('errors ref should have messages on validator.validate(), if wrong value is provided', () => {
        const errors = ref([]);
        const validator = factory({
            errors,
        });

        validator.validate(INCORRECT_EMAIL);

        expect(errors.value.length).toBeGreaterThan(0);
        expect(errors.value).toMatchInlineSnapshot(`
          [
            "Zadajte správny e-mail.",
          ]
        `);

        validator.validate('');
        expect(errors.value.length).toBeGreaterThan(0);
        expect(errors.value).toMatchInlineSnapshot(`
          [
            "Toto pole je povinné",
          ]
        `);
    });

    it('errors ref should be empty if value is correct', () => {
        const errors = ref([]);
        const validator = factory({
            errors,
        });

        validator.validate(CORRECT_EMAIL);

        expect(errors.value.length).toBe(0);
        expect(errors.value).toMatchInlineSnapshot('[]');
    });

    it('should change/set options with setOptions method', () => {
        const errors = ref([]);
        const validator = factory({
            errors,
        });
        const previousOptions = validator.options;

        validator.setOptions({
            event: INPUT_EVENT_TYPES.BLUR_INPUT,
            validators: [],
        });

        expect(validator.options).not.toEqual(previousOptions);
        expect(validator.options).toMatchInlineSnapshot(`
          {
            "event": "onBlurThenOnInput",
            "validators": [],
          }
        `);
    });

    it('should change/set element with setElement method', () => {
        const errors = ref([]);
        const validator = factory({
            errors,
        });
        const previousElement = validator.$el;
        validator.setElement(ref(document.createElement('input')));

        expect(validator.$el).not.toEqual(previousElement);
        expect(validator.$el?.value).toMatchInlineSnapshot('<input />');
    });

    it('calls validate on specific event', () => {
        const errors = ref([]);
        const validator = factory({
            errors,
        });
        validator.validate = vi.fn();

        validator.validateByEventType(INCORRECT_EMAIL, 'blur');
        expect(validator.validate).toBeCalledTimes(1);

        validator.validate = vi.fn();
        validator.validateByEventType(INCORRECT_EMAIL, 'input');
        expect(validator.validate).toBeCalledTimes(0);

        validator.setOptions({ event: INPUT_EVENT_TYPES.BLUR_INPUT });
        validator.validate = vi.fn();
        validator.validateByEventType(INCORRECT_EMAIL, 'input');
        expect(validator.validate).toBeCalledTimes(1);
    });
});
