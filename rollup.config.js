import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    dest: 'build/g-chartframe.js',
    format: 'umd',
    moduleName: 'gChartframe',
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
        resolve(),
        commonjs({
            namedExports: {
                'node_modules/save-svg-as-png/saveSvgAsPng.js': [
                    'saveSvgAsPng',
                ],
            },
        }),
    ],
};
