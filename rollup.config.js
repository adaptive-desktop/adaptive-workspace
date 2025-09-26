const typescript = require('@rollup/plugin-typescript');
const copy = require('rollup-plugin-copy');
const { readFileSync } = require('fs');

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['tests/**/*', '**/*.test.ts'],
      }),
      copy({
        targets: [
          {
            src: 'src/shared/test/desktop-snapshot.json',
            dest: 'dist/shared/test/'
          }
        ]
      })
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      'react/jsx-runtime',
    ],
  },
  {
    input: 'src/shared/test/loadDesktopSnapshot.ts',
    output: [
      {
        file: 'dist/shared/test/loadDesktopSnapshot.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: 'dist/shared/test/loadDesktopSnapshot.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        exclude: ['tests/**/*', '**/*.test.ts'],
      })
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      'react/jsx-runtime',
    ],
  }
];
