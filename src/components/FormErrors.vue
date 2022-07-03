<template>
    <div
        :class="rootClasses"
    >
        <ul>
            <!--eslint-disable vue/no-v-html-->
            <li
                v-for="(error, index) in errors"
                :key="index"
                :class="elementClassName.error"
                v-html="error"
            ></li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive, withDefaults } from 'vue';
import { generateElementClassNames, getClassName } from '@/helpers';

interface Props {
    errors?: Array<string>
}

const props = withDefaults(defineProps<Props>(), {
    errors: () => ([]),
    tooltipDistance: 0,
});
const CLASS_NAME = 'form-errors';
const rootClasses = computed<Record<string, boolean>>(() => ({
    [getClassName(CLASS_NAME)]: true,
    [getClassName(CLASS_NAME, null, 'is-error')]: hasError.value,
}));
const elementClassName = reactive(generateElementClassNames(
    CLASS_NAME,
    [
        'error',
    ]
));

const hasError = computed<boolean>(() => props.errors.length > 0);
</script>

<style lang="scss">
@import "@/scss/form-errors";
</style>
