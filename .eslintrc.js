module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  plugins: ["simple-import-sort", "unused-imports"],
  extends: [
    "plugin:react-hooks/recommended",
    "eslint:recommended",
    "next",
    "next/core-web-vitals",
    "prettier",
  ],
  rules: {
    // "no-unused-vars": "off",
    "no-unused-vars": [1, { args: "after-used", argsIgnorePattern: "^_" }],
    "no-console": "warn",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",
    "react/jsx-curly-brace-presence": [
      "warn",
      { props: "never", children: "never" },
    ],

    //#region  //*=========== Unused Import ===========
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
    //#endregion  //*======== Unused Import ===========

    //#region  //*=========== Import Sort ===========
    "simple-import-sort/exports": "warn",
    "simple-import-sort/imports": [
      "warn",
      {
        groups: [
          // ext library & side effect imports
          ["^@?\\w", "^\\u0000"],
          // {s}css files
          ["^.+\\.s?css$"],

          ["^@/lib", "^@/hooks"],
          // static data
          ["^@/data"],

          [
            "^@/components",
            "^@/container",
            "^@/context",
            "^@/actions",
            "^@/middleware",
            "^@/pages",
            "^@/utils",
            "^@/hocs",
            "^@/styles",
          ],
          // zustand store
          ["^@/store"],
          // Other imports
          ["^@/"],
          // relative paths up until 3 level
          [
            "^\\./?$",
            "^\\.(?!/?$)",
            "^\\.\\./?$",
            "^\\.\\.(?!/?$)",
            "^\\.\\./\\.\\./?$",
            "^\\.\\./\\.\\.(?!/?$)",
            "^\\.\\./\\.\\./\\.\\./?$",
            "^\\.\\./\\.\\./\\.\\.(?!/?$)",
          ],
          // other that didnt fit in
          ["^"],
        ],
      },
    ],
    //#endregion  //*======== Import Sort ===========
  },
  globals: {
    React: true,
    JSX: true,
  },
};
