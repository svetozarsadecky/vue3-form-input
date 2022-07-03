import { ref, shallowRef } from 'vue';
import type { App, ComponentInternalInstance } from 'vue';
import type { Emitter } from 'mitt';
import type { IMxFormHandler, TEvents } from '@/types/index';
import mitt from 'mitt';

interface IFormInstallerOptions {
    event: Emitter<TEvents>
}

enum FUNCTION_NAMES {
    VALIDATE = 'validate',
    CLEAR = 'clear',
}

// TODO: Add integration tests
function install(app: App, options: IFormInstallerOptions): void {
    const isCorrectVersion = formInstallerCheckVersion(app);

    if (!isCorrectVersion) {
        return;
    }

    if (app.config.globalProperties.$formHandler) {
        return;
    }

    const event: Emitter<TEvents> = mitt();
    const formHandler: IMxFormHandler = {
        activeItems: shallowRef([]),
        errors: ref({}),
        /**
         * Global validation method
         * used together with active subscribed form items
         *
         * Can call default validate method on component
         * if he is part of chosen form group
         * or even call a method with custom name if necessary
         *
         * @param groupName     - form group name
         * @param functionName  - custom validation method name
         */
        validate(groupName, functionName) {
            formInstallerCallFunctionOnItem.call(
                this,
                groupName,
                functionName || FUNCTION_NAMES.VALIDATE
            );
            formInstallerSetGatherErrors.call(this, groupName);

            return !this.hasErrors(groupName);
        },
        /**
         * Clears validation errors on form items
         * belonging to a chosen group
         *
         * @param groupName - form group name
         */
        clear(groupName: string) {
            formInstallerCallFunctionOnItem
                .call(this, groupName, FUNCTION_NAMES.CLEAR);
        },
        /**
         * Returns boolean value for specific form group's error state
         * @param groupName
         */
        hasErrors(groupName: string) {
            return this.errors.value[groupName].length > 0;
        },
        /**
         * Returns all errors in array for specific form group
         * @param groupName
         */
        getErrors(groupName) {
            formInstallerSetGatherErrors.call(this, groupName);

            return this.errors.value[groupName];
        },
    };

    app.config.globalProperties.$formHandler = formHandler;
    app.provide('formHandler', formHandler);
    app.provide('formHandlerEvent', event);

    event.on('subscribe', formInstallerSubscribeItem.bind(formHandler));
    event.on('unsubscribe', formInstallerUnsubscribeItem.bind(formHandler));
}

/**
 * Gather and set errors from all the form items
 * with specific group name to be accessible on the formHandler instance
 *
 * @param groupName
 */
function formInstallerSetGatherErrors(this: IMxFormHandler, groupName: string): void {
    this.errors.value[groupName] = [];

    formInstallerGetActiveGroupItems.call(this, groupName).forEach(
        async (item) => {
            const exposed = item.exposed;

            if (!exposed || exposed.formErrors.value.length === 0) {
                return;
            }

            this.errors.value[groupName].push(...exposed.formErrors.value);
        }
    );


}

/**
 * Checks if current Vue version is 3 or higher
 * @param app
 */
function formInstallerCheckVersion(app: App): boolean {
    const version = Number(app.version.split('.')[0]);

    if (version < 3) {
        console.warn('This plugin requires Vue 3');

        return false;
    }

    return true;
}

/**
 * Add form item to active items array
 * on mounted hook
 * @param item - form item component (input, select...)
 */
function formInstallerSubscribeItem(
    this: IMxFormHandler,
    item: ComponentInternalInstance | null
): void {
    if (item) {
        this.activeItems.value.push(item);
    }
}

/**
 * Remove form item from active items array
 * on before destroy hook
 * @param item - form item component (input, select...)
 */
function formInstallerUnsubscribeItem(
    this: IMxFormHandler,
    item: ComponentInternalInstance | null
): void {
    if (!item) {
        return;
    }

    const index = this.activeItems.value.indexOf(item);

    if (index !== -1) {
        this.activeItems.value.splice(index, 1);
    }
}

/**
 * Calls function on group of form items
 * if function exists and is exposed by form item
 * @param groupName          - group name for group of form items
 * @param functionName       - name of function to call
 */
function formInstallerCallFunctionOnItem(
    this: IMxFormHandler,
    groupName: string,
    functionName: FUNCTION_NAMES | string
): void {
    formInstallerGetActiveGroupItems.call(this, groupName)
        .forEach((item) => {
            const exposed = item.exposed;

            if (exposed && exposed[functionName]) {
                exposed[functionName]();
            }
        });
}

/**
 * Returns all active form items that are part of one group
 * @param groupName
 */
function formInstallerGetActiveGroupItems(
    this: IMxFormHandler,
    groupName: string,
): Array<ComponentInternalInstance> {
    return this.activeItems.value.filter((item: ComponentInternalInstance) =>
        !!item?.exposed?.groupName
        && item.exposed.groupName === groupName);
}

const plugin = {
    install,
};

export default plugin;
