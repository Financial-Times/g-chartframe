import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'index.js',
    dest: 'build/g-chartframe.js',
    format: 'umd',
    moduleName: 'gChartframe',
    plugins: [
        resolve(),
        commonjs({
            namedExports: {
                'node_modules/save-svg-as-png/saveSvgAsPng.js': ['saveSvgAsPng'],
            },
        }),
    ],
};
