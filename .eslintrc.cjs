/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
    'root': true,
    'extends': [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        '@vue/eslint-config-typescript/recommended',
    ],
    'env': {
        'vue/setup-compiler-macros': true,
    },
    'rules': {
        'indent': 0,
        'semi': [2, 'always'],
        'object-curly-spacing': [2, 'always'],
        'quotes': [2, 'single', 'avoid-escape'],
        'vue/script-indent': [
            2,
            4,
        ],
        'vue/html-indent': [
            2,
            4,
        ],
        'vue/require-v-for-key': 1,
        'vue/html-self-closing': [
            2,
            {
                'html': {
                    'normal': 'never',
                    'component': 'never',
                },
            },
        ],
        'camelcase': 0,
        'import/prefer-default-export': 0,
        'no-param-reassign': [
            2,
            {
                'props': false,
            },
        ],
        'no-lonely-if': 0,
        'arrow-parens': [
            2,
            'as-needed',
            {
                'requireForBlockBody': true,
            },
        ],
        'class-methods-use-this': 0,
    },
};
