import { src, dest, watch, parallel } from 'gulp';
import less from 'gulp-less';
import babel from "gulp-babel";
import sourcemaps from "gulp-sourcemaps";

const paths = {
    styles: {
      src: 'src/**/*.less',
      dest: 'dist/'
    },
    scripts: {
      src: 'src/**/*.ts',
      dest: 'dist/'
    }
};

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
  return src(paths.styles.src, { sourcemaps: true })
    .pipe(less())
    .pipe(dest(paths.styles.dest));
}

export function scripts() {
  return src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel({
      sourceMap: true,
      sourceType: "module",
      // sourceMaps: true,
      compact: false,
      comments: false,
      getModuleId: () => "v",
      "plugins": [
        "@babel/plugin-syntax-explicit-resource-management",
        "@babel/plugin-proposal-explicit-resource-management",
        "@babel/plugin-transform-dynamic-import",
        "@babel/plugin-transform-modules-systemjs",
        "@babel/plugin-transform-typescript",
        ["@babel/plugin-proposal-decorators", { "version": "2023-11" } ]
      ],
      presets: [
        {
            sourceType: "module",
            sourceMaps: true,
            compact: false,
            comments: false,
            getModuleId: () => "v",
            "plugins": [
              "@babel/plugin-syntax-explicit-resource-management",
              "@babel/plugin-proposal-explicit-resource-management",
              "@babel/plugin-transform-dynamic-import",
              "@babel/plugin-transform-modules-systemjs",
              "@babel/plugin-transform-typescript",
              ["@babel/plugin-proposal-decorators", { "version": "2023-11" } ]
            ],      
        }
      ]
    }))
    .pipe(dest(paths.scripts.dest));
}

/*
* You could even use `export as` to rename exported tasks
*/
function watchFiles() {
    watch(paths.scripts.src, scripts);
    watch(paths.styles.src, styles);
}

export { watchFiles as watch };

const build = parallel(styles, scripts);
/*
* Export a default task
*/
export default build;