import type { Emitter } from 'mitt';
import type { TEvents } from '@/types/index';
import { type ComponentInternalInstance, getCurrentInstance, inject } from 'vue';

export default function() {
    /**
     * Lifecycle hooks subscribing/unsubscribing from active Form items
     */
    function onItemMounted() {
        event?.emit('subscribe', Instance);
    }

    function onItemBeforeUnmount() {
        event?.emit('unsubscribe', Instance);
    }

    const event: Emitter<TEvents> | undefined = inject('formHandlerEvent');
    const Instance: ComponentInternalInstance | null = getCurrentInstance();

    return {
        Instance,
        event,
        onItemMounted,
        onItemBeforeUnmount,
    };
}
