module.exports = (ctx) => ({
    map: { ... ctx.options.map, sourcesContent: false },
    plugins: [
        require("postcss-import-styled-js")(),
        require('postcss-preset-env')({
          stage: 4
        }),
        require("postcss-import-ext-glob")(),
        require("postcss-import")(),
        require("postcss-nested")(),
        require("postcss-url")({
          url: "copy",
          basePath: ctx.options.base,
          assetsPath: ctx.options.dist
        }),
        require("cssnano")()
    ]
  });
  