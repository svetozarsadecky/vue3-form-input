import validators from '@/constants/validators';
import type {
    IFormInputValidator,
    IFormValidatorOptions,
    TFormInputValue,
    TTransProxy
} from '@/types';
import { INPUT_EVENT_TYPES } from '@/types';
import type { Ref } from 'vue';

export default class FormValidator {
    public errors: Ref<Array<string>>;
    public options: IFormValidatorOptions;
    public trans: TTransProxy;
    public $el?: Ref<HTMLInputElement | null>;

    constructor(
        options = {},
        errors: Ref<Array<string>>,
        trans: TTransProxy = (value => value),
        el?: Ref<HTMLInputElement | null>,
    ) {
        this.options = options;
        this.trans = trans;
        this.$el = el;
        this.errors = errors;
    }

    get type(): (type: IFormInputValidator['validator']) => string {
        return (type) => {
            if (typeof type !== 'string') {
                return '';
            }

            return type.split(':')[0];
        };
    }

    get validator(): (type: IFormInputValidator['validator']) => IFormInputValidator | undefined {
        return type => this.options
            && this.options.validators?.find(
                validator => this.type(validator.validator) === type);
    }

    public setElement(el: Ref<HTMLInputElement | null>) {
        this.$el = el;
    }

    public setOptions(options: IFormValidatorOptions) {
        this.options = { ...this.options, ...options };
    }

    public validate(value: TFormInputValue, init?: boolean) {
        this.errors.value = [];
        const { validators } = this.options;

        const hasRequired = validators?.findIndex(
            item => item.validator === 'required') !== -1;

        if (hasRequired && !init) {
            const requiredError = this.validateType(value, 'required');

            if (requiredError) {
                this.errors.value = [requiredError];
                return;
            }
        }

        if (
            !!value
            && validators
        ) {
            this.validateTypes(value, validators);
        }
    }

    validateTypes(
        value: TFormInputValue,
        validators: Array<IFormInputValidator>
    ): void {
        this.errors.value = [];

        validators.forEach((validatorObject) => {
            const {
                message = 'Custom error message',
                validator,
            } = validatorObject;

            if (typeof validator === 'function') {
                if (!validator(value)) {
                    this.errors.value.push(this.trans(message));
                }

                return;
            }

            const error = this.validateType(value, validator);

            if (error) {
                this.errors.value.push(error);
            }
        });
    }

    validateType(
        value: TFormInputValue,
        validator:IFormInputValidator['validator']
    ): string | null {
        const [command, rawAttrs] =  typeof validator === 'string'
            ? validator.split(':')
            : '';
        const attrs = rawAttrs ? rawAttrs.split(',') : [];
        const validatorType = validators[command];
        const isError = validatorType.test
            && !validatorType.test(value, attrs, this.$el?.value);

        if (isError) {
            const validationOutput = this.validator(command);

            if (!validationOutput) {
                return null;
            }

            const customMessage = validationOutput.message
                || validatorType.message;

            return this.trans(customMessage)
                .replace(
                    /\$(\d+)/g,
                    (match, number) => attrs[+number],
                );
        }

        return null;
    }

    public validateByEventType(
        value: TFormInputValue,
        type: string,
        callback?: (...args: never) => void
    ): void {
        if (this.options.event === INPUT_EVENT_TYPES.BLUR_INPUT) {
            if (type === 'input' || type === 'blur') {
                this.validate(value);
                if (typeof callback === 'function') {
                    callback();
                }
            }
        }

        if (this.options.event === INPUT_EVENT_TYPES.BLUR
            && type === 'blur') {
            this.validate(value);

            if (typeof callback === 'function') {
                callback();
            }
        }

        if (this.options.event === INPUT_EVENT_TYPES.INPUT
            && type === 'input') {
            this.validate(value);

            if (typeof callback === 'function') {
                callback();
            }
        }
    }
}
