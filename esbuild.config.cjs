const esbuild = require("esbuild");
const { sassPlugin } = require("esbuild-sass-plugin");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const postcssPresetEnv = require("postcss-preset-env");

esbuild
  .context({
    entryPoints: ["src/index.js", "src/styles/index.css"], // Input files
    outdir: "public", // Output directory
    bundle: true, // Bundle files
    minify: true, // Minify output
    plugins: [
      sassPlugin({
        async transform(source, resolveDir, filePath) {
          const { css } = await postcss([
            autoprefixer,
            postcssPresetEnv({ stage: 0 }),
          ]).process(source, { from: filePath });

          return css;
        },
      }),
    ],
  })
  .then((ctx) => {
    ctx.watch().then(() => {
      console.log("Watching...");
    });
  })
  .catch(() => process.exit(1));
