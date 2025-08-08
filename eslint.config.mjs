import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 继承 Next.js 的核心规则
  ...compat.extends('next/core-web-vitals'),

  {
    files: ['src/**/*.{js,jsx,ts,tsx}'], // 指定这些规则应用于 src 目录下的所有文件
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];

export default eslintConfig;
