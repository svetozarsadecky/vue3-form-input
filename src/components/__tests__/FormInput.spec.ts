import { describe, it, expect, vi } from 'vitest';
import { DOMWrapper, mount } from '@vue/test-utils';
import FormInput from '@/components/FormInput.vue';
import { reactive } from 'vue';
import { FORM_INPUT_FULL } from '@/components/__tests__/mocks/formInput';
import type { IInput } from '@/types/form';
import FormInstaller from '@/services/FormInstaller';
import { INPUT_TYPES } from '@/constants/form';
import { INPUT_EVENT_TYPES } from '@/types/form';

const INPUT_SELECTOR = '[data-test=form-input__input]';
const STATE_SELECTOR = '[data-test=form-input__errors]';
const SLOT_PREPEND_SELECTOR = '[data-test=form-input__prepend]';
const SLOT_LABEL_SELECTOR = '[data-test=form-input__label]';
const SLOT_SUFFIX_SELECTOR = '[data-test=form-input__suffix]';
const SLOT_APPEND_SELECTOR = '[data-test=form-input__append]';
const SLOT_MESSAGE_SELECTOR = '[data-test=form-input__message]';

const input = reactive<IInput>(FORM_INPUT_FULL);

const defaultOptions = {
    floatingVue: {},
    // Options: {
    //      trans
    //      ...
    // }
    formInstaller: {},
};

vi.mock('@/mixins/FormItemInstaller', async () => {
    return {
        default: () => ({
            onItemMounted: vi.fn(),
            onItemBeforeUnmount: vi.fn(),
        })
    };
});

const factory = ({ props = {}, slots = {}, global = {} } = {}) => mount(FormInput, {
    props: {
        input,
        ...props,
    },
    slots: {
        ...slots,
    },
    global: {
        directives: {
            tooltip: vi.fn()
        },
        plugins: [[FormInstaller, { ...defaultOptions }]],
        ...global,
    }
});

describe('FormInput props, slots & events', () => {
    it('renders component', () => {
        const wrapper = factory();

        expect(wrapper.html()).toMatchSnapshot();
    });

    it('renders with input.required set to true', async () => {
        const wrapper = factory({
            props: {
                input: { ...input, required: true },
            }
        });

        expect(wrapper.attributes().class).toMatchInlineSnapshot('"form-input form-input--is-required"');
    });

    it('renders with input.disabled set to true', () => {
        const wrapper = factory({
            props: {
                input: { ...input, disabled: true },
            }
        });

        const inputEl: DOMWrapper<HTMLInputElement | HTMLTextAreaElement> = wrapper.find(INPUT_SELECTOR);

        expect(inputEl.element.disabled).toBe(true);
        expect(wrapper.attributes().class).toMatchInlineSnapshot('"form-input form-input--is-disabled"');
    });

    it('renders with input.readonly set to true', async () => {
        const wrapper = factory({
            props: {
                input: { ...input, readonly: true },
            }
        });

        expect(wrapper.attributes().class).toMatchInlineSnapshot('"form-input form-input--is-readonly"');
    });

    it('renders input type hidden', async () => {
        const wrapper = factory({
            props: {
                input: { ...input, type: INPUT_TYPES.HIDDEN },
            }
        });

        const inputEl: DOMWrapper<HTMLInputElement | HTMLTextAreaElement> = wrapper.find(INPUT_SELECTOR);

        expect(inputEl.element.type).toBe(INPUT_TYPES.HIDDEN);
        expect(wrapper.attributes().class).toMatchInlineSnapshot('"form-input form-input--is-hidden"');
    });

    it('renders with filled class when modelValue is set', async () => {
        const wrapper = factory({
            props: {
                modelValue: 'text',
            }
        });

        const inputEl: DOMWrapper<HTMLInputElement | HTMLTextAreaElement> = wrapper.find(INPUT_SELECTOR);

        expect(inputEl.element.value).toBe('text');
        expect(wrapper.attributes().class).toMatchInlineSnapshot('"form-input form-input--is-filled"');
    });

    it('renders textarea instead input', async () => {
        const wrapper = factory({
            props: {
                input: {
                    ...input,
                    type: INPUT_TYPES.TEXTAREA,
                    rows: 1,
                },
            }
        });

        const inputEl: DOMWrapper<HTMLInputElement | HTMLTextAreaElement> = wrapper.find(INPUT_SELECTOR);

        expect(inputEl.element.type).toBe(INPUT_TYPES.TEXTAREA);
        expect(wrapper.attributes().class).toMatchInlineSnapshot('"form-input form-input--textarea"');
    });

    it('renders slot content for prepend', async () => {
        const wrapper = factory({
            slots: {
                prepend: 'Some content',
            }
        });

        const slot: DOMWrapper<HTMLDivElement> = wrapper.find(SLOT_PREPEND_SELECTOR);

        expect(slot.exists()).toBe(true);
        expect(slot.html()).toContain('Some content');
    });

    it('renders slot content for label', async () => {
        const wrapper = factory({
            slots: {
                label: 'Some content',
            }
        });

        const slot: DOMWrapper<HTMLDivElement> = wrapper.find(SLOT_LABEL_SELECTOR);

        expect(slot.exists()).toBe(true);
        expect(slot.html()).toContain('Some content');
    });

    it('renders slot content for suffix', async () => {
        const wrapper = factory({
            slots: {
                suffix: 'Some content',
            }
        });

        const slot: DOMWrapper<HTMLDivElement> = wrapper.find(SLOT_SUFFIX_SELECTOR);

        expect(slot.exists()).toBe(true);
        expect(slot.html()).toContain('Some content');
    });

    it('renders slot content for append', async () => {
        const wrapper = factory({
            slots: {
                append: 'Some content',
            }
        });

        const slot: DOMWrapper<HTMLDivElement> = wrapper.find(SLOT_APPEND_SELECTOR);

        expect(slot.exists()).toBe(true);
        expect(slot.html()).toContain('Some content');
    });

    it('renders slot content for message', async () => {
        const wrapper = factory({
            slots: {
                message: 'Some content',
            }
        });

        const slot: DOMWrapper<HTMLDivElement> = wrapper.find(SLOT_MESSAGE_SELECTOR);

        expect(slot.exists()).toBe(true);
        expect(slot.html()).toContain('Some content');
    });

    it('emits update event on input', async () => {
        const wrapper = factory();
        await wrapper.setProps({
            modelValue: 'Some content',
        });

        const inputEl: DOMWrapper<HTMLInputElement> = wrapper.find(INPUT_SELECTOR);
        await inputEl.trigger('input');

        expect(inputEl.element.value).toMatchInlineSnapshot('"Some content"');
        expect(wrapper.emitted()).toMatchInlineSnapshot(`
          {
            "eager": [
              [
                Event {
                  "isTrusted": false,
                },
              ],
            ],
            "input": [
              [
                Event {
                  "isTrusted": false,
                },
              ],
            ],
            "update:modelValue": [
              [
                "Some content",
              ],
            ],
          }
        `);
    });

    it('emits focus event on input focus', async () => {
        const wrapper = factory();

        const inputEl: DOMWrapper<HTMLInputElement> = wrapper.find(INPUT_SELECTOR);
        await inputEl.trigger('focus');

        expect(wrapper.emitted()).toMatchInlineSnapshot(`
          {
            "focus": [
              [
                FocusEvent {
                  "isTrusted": false,
                },
              ],
            ],
          }
        `);
    });

    it('emits blur event on input blur', async () => {
        const wrapper = factory();

        const inputEl: DOMWrapper<HTMLInputElement> = wrapper.find(INPUT_SELECTOR);
        await inputEl.trigger('blur');

        expect(wrapper.emitted()).toMatchInlineSnapshot(`
          {
            "blur": [
              [
                FocusEvent {
                  "isTrusted": false,
                },
              ],
            ],
          }
        `);
    });

    it('emits keydown event on input keydown', async () => {
        const wrapper = factory();

        const inputEl: DOMWrapper<HTMLInputElement> = wrapper.find(INPUT_SELECTOR);
        await inputEl.trigger('keydown');

        expect(wrapper.emitted()).toMatchInlineSnapshot(`
          {
            "keydown": [
              [
                KeyboardEvent {
                  "isTrusted": false,
                },
              ],
            ],
          }
        `);
    });

    it('emits keyup event on input keyup', async () => {
        const wrapper = factory();

        const inputEl: DOMWrapper<HTMLInputElement> = wrapper.find(INPUT_SELECTOR);
        await inputEl.trigger('keyup');

        expect(wrapper.emitted()).toMatchInlineSnapshot(`
          {
            "keyup": [
              [
                KeyboardEvent {
                  "isTrusted": false,
                },
              ],
            ],
          }
        `);
    });

    it('renders text processed with trans function', async () => {
        const wrapper = factory({
            props: {
                trans(value: string) {
                    return `Processed ${value}`;
                },
                input: { ...input, label: 'My label' },
            }
        });

        const labelSlot = wrapper.find(SLOT_LABEL_SELECTOR);
        expect(labelSlot.html()).toContain('Processed My label');
    });
});

describe('FormInput errors and validation', () => {
    it('renders error state component on error', async () => {
        const wrapper = factory();
        const inputEl: DOMWrapper<HTMLInputElement> = wrapper.find(INPUT_SELECTOR);

        await inputEl.trigger('blur');

        const stateEl: DOMWrapper<HTMLInputElement> = wrapper.find(STATE_SELECTOR);
        expect(stateEl.exists()).toBe(true);
    });

    it('renders with error class on blur', async () => {
        const wrapper = factory();

        const inputEl: DOMWrapper<HTMLInputElement> = wrapper.find(INPUT_SELECTOR);
        await inputEl.trigger('blur');

        expect(wrapper.emitted()).toMatchInlineSnapshot(`
          {
            "blur": [
              [
                FocusEvent {
                  "isTrusted": false,
                },
              ],
            ],
          }
        `);
        expect(wrapper.attributes().class).toContain('form-input--has-error');
    });

    it('renders with error class on input', async () => {
        const wrapper = factory({
            props: {
                input: { ...input, validatorEvent: INPUT_EVENT_TYPES.INPUT },
            }
        });

        const inputEl: DOMWrapper<HTMLInputElement> = wrapper.find(INPUT_SELECTOR);
        await inputEl.trigger('input');

        expect(wrapper.emitted()).toMatchInlineSnapshot(`
          {
            "eager": [
              [
                Event {
                  "isTrusted": false,
                },
              ],
            ],
            "input": [
              [
                Event {
                  "isTrusted": false,
                },
              ],
            ],
            "update:modelValue": [
              [
                "",
              ],
            ],
          }
        `);
        expect(wrapper.attributes().class).toContain('form-input--has-error');
    });

    it('renders with error class on input then on blur', async () => {
        const wrapper = factory({
            props: {
                input: { ...input, validatorEvent: INPUT_EVENT_TYPES.BLUR_INPUT },
            }
        });

        const inputEl: DOMWrapper<HTMLInputElement> = wrapper.find(INPUT_SELECTOR);
        await inputEl.trigger('input');

        expect(wrapper.emitted()).toMatchInlineSnapshot(`
          {
            "eager": [
              [
                Event {
                  "isTrusted": false,
                },
              ],
            ],
            "input": [
              [
                Event {
                  "isTrusted": false,
                },
              ],
            ],
            "update:modelValue": [
              [
                "",
              ],
            ],
          }
        `);
        expect(wrapper.attributes().class).toContain('form-input--has-error');

        await wrapper.setProps({
            modelValue: 'wrong email',
        });

        await inputEl.trigger('blur');
        expect(wrapper.emitted()).toMatchInlineSnapshot(`
          {
            "blur": [
              [
                FocusEvent {
                  "isTrusted": false,
                },
              ],
            ],
            "eager": [
              [
                Event {
                  "isTrusted": false,
                },
              ],
            ],
            "input": [
              [
                Event {
                  "isTrusted": false,
                },
              ],
            ],
            "update:modelValue": [
              [
                "",
              ],
            ],
          }
        `);
        expect(wrapper.attributes().class).toContain('form-input--has-error');
    });

    it('renders valid state, when validate method is called and value passes validation check', async () => {
        const wrapper = factory({
            props: {
                modelValue: 'email@domain.sk',
            }
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        wrapper.vm.validate();

        await wrapper.vm.$nextTick();
        const stateEl: DOMWrapper<HTMLInputElement> = wrapper.find(STATE_SELECTOR);
        expect(stateEl.exists()).toBe(true);
        expect(wrapper.attributes().class).toContain('is-valid');
        expect(stateEl.html()).toMatchInlineSnapshot(`
          "<div class=\\"form-errors\\" data-test=\\"form-input__errors\\">
            <ul>
              <!--eslint-disable vue/no-v-html-->
            </ul>
          </div>"
        `);
    });

    it('renders invalid state, when validate method is called and value doesnt pass validation check', async () => {
        const wrapper = factory({
            props: {
                modelValue: 'email domain',
            }
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        wrapper.vm.validate();

        await wrapper.vm.$nextTick();
        const stateEl: DOMWrapper<HTMLInputElement> = wrapper.find(STATE_SELECTOR);
        expect(stateEl.exists()).toBe(true);
        expect(wrapper.attributes().class).toContain('has-error');
        expect(stateEl.html()).toMatchInlineSnapshot(`
          "<div class=\\"form-errors form-errors--is-error\\" data-test=\\"form-input__errors\\">
            <ul>
              <!--eslint-disable vue/no-v-html-->
              <li class=\\"form-errors__error\\">Zadajte správny e-mail.</li>
            </ul>
          </div>"
        `);
    });

    it('clears rendered error state and value', async () => {
        const wrapper = factory({
            props: {
                modelValue: 'email domain',
            },
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        wrapper.vm.validate();
        await wrapper.vm.$nextTick();

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        wrapper.vm.clear();
        await wrapper.vm.$nextTick();

        const stateEl: DOMWrapper<HTMLInputElement> = wrapper.find(STATE_SELECTOR);
        const inputEl: DOMWrapper<HTMLInputElement> = wrapper.find(INPUT_SELECTOR);
        expect(stateEl.exists()).toBe(false);
        expect(inputEl.element.value).toBe('');
        expect(wrapper.attributes().class).not.toContain('has-error');
    });

    it('subscribes to a global handler on mount', async () => {
        const wrapper = factory();

        expect((wrapper.vm as any).onItemMounted).toBeCalled();
    });

    it('unsubscribes from a global handler on before unmount', async () => {
        const wrapper = factory();

        wrapper.unmount();

        expect((wrapper.vm as any).onItemBeforeUnmount).toBeCalled();
    });
});
