import babel from "rollup-plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";
export default [
  {
    input: "./src/index.js",
    output: [{ file: "dist/index.es.js", format: "es", exports: "named" }],
   plugins: [
      postcss(),
      babel({ exclude: "node_modules/**", presets: ["@babel/preset-react"] }),
      external(),
      resolve(),
      terser(),
      {
        name: "custom-message", 
        buildEnd() {
          console.log(
            "🎉 Compilation Complete! Your code is ready.",
            new Date().toLocaleTimeString("en-GB", {
              hour12: true,
            })
          );
        },
      },
    ],
  },
];
