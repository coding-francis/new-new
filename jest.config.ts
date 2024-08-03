import { Config } from 'jest';

const isIntegrationTest = process.env.TEST_TYPE === 'integration';

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: isIntegrationTest
        ? ['**/tests/integration/**/*.(test|spec).ts']
        : ['/**/src/**/?(*.)+(spec|test).ts?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    coverageDirectory: isIntegrationTest
        ? './coverage-integration'
        : './coverage',
    maxWorkers: isIntegrationTest ? 1 : 5, //Integration tests should run sequentially. Cleanup phase is needed to create fresh database for next test
};

export default config;
