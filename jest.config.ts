import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
        // Process `*.tsx` files with `ts-jest`
        '^.+\\.tsx?$': 'ts-jest',
    },
    moduleNameMapper: {
        // Map all aliases from tsconfig
        ...pathsToModuleNameMapper(compilerOptions.paths, {
            prefix: '<rootDir>/',
        }),
        // Mock files
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__ mocks __/fileMock.js',
        // Specifically link unws to the commonjs file
        unws: '<rootDir>/node_modules/unws/src/node.js',
    },
};
