import type { App } from 'vue';
import FormInput from '@/components/FormInput.vue';
import FormErrors from '@/components/FormErrors.vue';
import MxFormInstaller from  '@/services/FormInstaller';

const components = {
    FormInput,
    FormErrors,
};

// TODO: Add global options object with options to configure the theme
const options = {};

function install(app: App) {
    app.use(MxFormInstaller, {
        ...options,
    });

    // tslint:disable-next-line: forin
    for (const component in components) {
        // @ts-expect-error no type
        app.component(components[component].name, components[component]);
    }
}

export default { install };

export { default as FormInput } from '@/components/FormInput.vue';
export { default as FormErrors } from '@/components/FormErrors.vue';
