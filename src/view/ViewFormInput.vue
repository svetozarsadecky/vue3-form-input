<template>
    <div>
        <form>
            <h1 class="text-center">
                Form input
            </h1>

            <h3>Simple: {{ simple.value }}</h3>
            <FormInput
                :ref="`ref_${simple.name}`"
                v-model="simple.value"
                :input="simple"
            ></FormInput>

            <h3>Simple naked</h3>
            <FormInput
                :ref="`ref_${simple.name}`"
                v-model="simple.value"
                class-name="naked"
                :input="simple"
            ></FormInput>

            <h3>Full example: {{ full.value }}</h3>
            <FormInput
                :ref="full.name"
                v-model="full.value"
                :bind-to-input="{ 'data-hj-whitelist': true }"
                :form-errors="beErrors.full"
                :input="full"
                :trans="customTranslate"
                class="form-input--group"
                input-class="custom-class-for-input"
                group-name="form-input-form-1"
            >
                <template #prepend>
                    <div class="form-input__readonly">
                        Your
                    </div>
                </template>
                <template #suffix>
                    *Required input
                </template>
                <template #message>
                    Some message
                </template>
            </FormInput>

            <h3>ZIP (with validator): {{ zip.value }} {{ zip.name }}</h3>
            <FormInput
                :ref="`ref_${zip.name}`"
                v-model="zip.value"
                :input="zip"
                group-name="form-input-form-1"
            ></FormInput>

            <h3>Textarea: {{ textarea.value }}</h3>
            <FormInput
                :ref="`ref_${textarea.name}`"
                v-model="textarea.value"
                :input="textarea"
                :trans="customTranslate"
            ></FormInput>

            <h3>Hidden: {{ hidden.value }}</h3>
            <p>
                Start:
                <FormInput
                    :ref="`ref_${hidden.name}`"
                    v-model="hidden.value"
                    :input="hidden"
                    group-name="form-input-form-1"
                ></FormInput>
                end;
            </p>
            <p>
                Set hidden value:<br>
                <label>
                    <input
                        v-model="hidden.value"
                        type="text"
                    >
                </label>
            </p>

            <div>
                <ul>
                    <li
                        v-for="(error, index) in errors"
                        :key="index"
                        v-text="error"
                    ></li>
                </ul>
            </div>

            <button
                @click.prevent="setErrors()"
            >
                Set errors
            </button>
            <button
                @click.prevent="clearErrors('form-input-form-1')"
            >
                Clear
            </button>
            <button
                @click.prevent="submit('form-input-form-1')"
            >
                Submit
            </button>
        </form>
        <form>
            <h3>Number: {{ number.value }}</h3>
            <FormInput
                :ref="`ref_${number.name}`"
                v-model="number.value"
                :input="number"
                group-name="form-input-form-2"
            ></FormInput>

            <div>
                <ul>
                    <li
                        v-for="(error, index) in errors2"
                        :key="index"
                        v-text="error"
                    ></li>
                </ul>
            </div>

            <button
                @click.prevent="clearErrors('form-input-form-2')"
            >
                Clear
            </button>
            <button
                @click.prevent="submit('form-input-form-2')"
            >
                Submit
            </button>
        </form>
    </div>
</template>

<script lang="ts" setup>
import FormInput from '@/components/FormInput.vue';
import { ref, reactive, inject, nextTick } from 'vue';
import { INPUT_TYPES } from '@/constants/form';
import type { IInput, IMxFormHandler, TFormInputValue } from '@/types';

const myFunc = (param: string) => (value: TFormInputValue) => typeof value === 'string'
    && value.indexOf(`${param}doe`) !== -1;

const beErrors = ref<Record<string, Array<string>>>({});
const simple: IInput = {
    label: 'Simple',
    value: 'Jozko Mrkva',
    name: 'simple',
    disabled: true
};
const number = reactive<IInput>({
    label: 'Number',
    value: '',
    type: INPUT_TYPES.NUMBER,
    pattern: '\\d*',
    name: 'number',
    required: true,
    validators: [
        {
            validator: 'min:5',
            message: 'Iba $0 znakov',
        },
    ],
    validatorEvent: 'onBlurThenOnInput',
});
const full = reactive<IInput>({
    id: 'full-email',
    type: INPUT_TYPES.EMAIL,
    name: 'email',
    required: true,
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
            validator: myFunc('john.'),
        },
        {
            validator: 'required',
        },
    ],
    validatorEvent: 'onBlur',
});
const zip = reactive<IInput>({
    name: 'zip',
    label: 'ZIP',
    required: true,
    validators: [
        {
            validator: 'zip',
        },
    ],
    validatorEvent: 'onInput',
    value: 'mario',
});
const textarea = reactive<IInput>({
    name: 'textarea',
    type: INPUT_TYPES.TEXTAREA,
    label: 'Textarea',
    // placeholder: 'Textarea placeholder',
    rows: 3,
    value: 'Some text just for textarea',
});
const hidden = reactive<IInput>({
    value: '',
    name: 'hidden',
    type: INPUT_TYPES.HIDDEN,
    required: true,
    validators: [
        {
            validator: 'required',
        },
    ],
    validatorEvent: 'onBlurThenOnInput',
});
/**
 * Initiate global form handler
 */
const formHandler: IMxFormHandler | undefined = inject('formHandler');
const errors = ref<Array<string>>([]);
const errors2 = ref<Array<string>>([]);

function customTranslate(key: string): string {
    if (!key) {
        return '';
    }

    return key.toUpperCase();
}

function submit(groupName: string) {
    formHandler?.validate(groupName);

    if (groupName === 'form-input-form-1') {
        errors.value = formHandler
            ? formHandler.getErrors(groupName)
            : [];
    } else {
        errors2.value = formHandler
            ? formHandler.getErrors(groupName)
            : [];
    }
}

function clearErrors(groupName: string) {
    formHandler?.clear(groupName);
}

async function setErrors() {
    beErrors.value = {};
    beErrors.value = {
        full: [
            'Error 1',
            'Error 2',
        ]
    };

    await nextTick();

    errors.value = formHandler
        ? formHandler.getErrors('form-input-form-1')
        : [];
}
</script>
