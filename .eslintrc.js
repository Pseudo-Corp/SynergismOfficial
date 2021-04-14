module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        // for some APIs (namely document.getElementById/querySelector/etc), we can
        // guarantee an element will be on the page.
        '@typescript-eslint/no-non-null-assertion': 'off'
    }
};