import { Config } from 'jest';

const testType = process.env.TEST_TYPE;

const config: Config = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch:
        testType === 'integration'
            ? ['**/tests/integration/**/*.(test|spec).ts']
            : ['/**/src/**/?(*.)+(spec|test).ts?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    coverageDirectory: './coverage',
    maxWorkers: 3,
};

export default config;
