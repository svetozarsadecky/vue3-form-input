<template>
    <div class="container py-2">
        <ViewFormInput></ViewFormInput>
    </div>
</template>

<script lang="ts" setup>
import ViewFormInput from '@/view/ViewFormInput.vue';
//
// export default {
//     name: 'App',
//     data() {
//         return {
//             beErrors: {},
//         };
//     },
//     methods: {
//         submit() {
//             if (this.$formItem.validate('form-input-form-1')) {
//                 // eslint-disable-next-line no-console
//                 console.log('no errors');
//             }
//         },
//         clearErrors() {
//             this.$formItem.clear('form-input-form-1');
//         },
//         setBeErrors() {
//             this.beErrors = {
//                 full: ['BE required'],
//             };
//         },
//     },
// };
</script>

<style lang="scss">
@import "@/scss/app";
</style>
