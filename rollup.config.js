import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";

const baseConfig = {
    input: "index.js",
    plugins: [
        babel({
            exclude: "node_modules/**"
        }),
        resolve(),
        commonjs({
            namedExports: {
                "node_modules/save-svg-as-png/lib/saveSvgAsPng.js": [
                    "saveSvgAsPng"
                ]
            }
        })
    ],
    onwarn: function(warning, warn) {
        if (warning.code === "CIRCULAR_DEPENDENCY") return;
        warn(warning);
    }
};

export default [
    {
        ...baseConfig,
        output: {
            file: "build/g-chartframe.mjs",
            format: "es"
        }
    },
    {
        ...baseConfig,
        output: {
            file: "build/g-chartframe.js",
            format: "umd",
            name: "gChartframe"
        }
    }
];
