/** @typedef {import('ts-jest/dist/types')} */
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
    projects: [
        '<rootDir>/libs/sherlock',
        '<rootDir>/libs/sherlock-utils',
        '<rootDir>/libs/sherlock-rxjs',
        '<rootDir>/libs/ngx-sherlock',
    ],
};
