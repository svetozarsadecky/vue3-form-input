import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import MxFormState from '@/components/FormErrors.vue';

const factory = ({ props = {} } = {}) => mount(MxFormState, {
    attachTo: 'body',
    props: {
        ...props,
    },
    global: {
        directives: {
            tooltip: vi.fn()
        },
    }
});

describe('FormErrors', () => {
    it('should render component in success state', function () {
        const wrapper = factory();

        expect(wrapper.attributes().class).not.toContain('form-errors--is-error');
        expect(wrapper.html()).toMatchSnapshot();
    });

    it('should render component in error state', function () {
        const wrapper = factory({
            props: {
                errors: ['error1', 'error2'],
            }
        });

        expect(wrapper.attributes().class).toContain('form-errors--is-error');
        expect(wrapper.html()).toMatchSnapshot();
    });
});
