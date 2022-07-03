import type { ComponentInternalInstance } from 'vue';

export * from './form';

export type TEvents = {
    subscribe: ComponentInternalInstance | null,
    unsubscribe: ComponentInternalInstance | null,
}

/**
 * Generic type for ***`Input`*** elements which contains details of target element
 */
export interface IExtendedInputEvent extends InputEvent {
    target: HTMLInputElement;
}

