import { Batch, invoke, ProcessFiles, watch } from "@neurospeech/jex";
import path from "node:path";
import { writeFile } from "node:fs/promises";
import * as babel from "@babel/core";

const presets = {
    sourceType: "module",
    sourceMaps: true,
    compact: false,
    comments: false,
    getModuleId: () => "v",
    "plugins": [
        import.meta.resolve("@babel/plugin-syntax-explicit-resource-management"),
        import.meta.resolve("@babel/plugin-proposal-explicit-resource-management"),
        import.meta.resolve("@babel/plugin-transform-dynamic-import"),
        import.meta.resolve("@babel/plugin-transform-modules-systemjs"),
        [import.meta.resolve("@babel/plugin-syntax-decorators"), { "version": "2023-11" }],
        import.meta.resolve("@babel/plugin-transform-typescript")
    ]
};


await watch(() => invoke(<Batch>
    <ProcessFiles
        src="src/**/*.ts"
        dest="dist/"
        replaceExtension=".js"
        command={({ file, dest }) => <BabelTS
            file={file}
            dest={dest}
            /> }
        />
</Batch>));

async function BabelTS({ file, dest }) {
    const result = await babel.transformFileAsync(file.path, presets);
    await dest.write(result.code + `\r\n//# sourceMappingURL=${file.baseName}.map`, "utf8");
    await writeFile(dest.path + ".map", JSON.stringify(result.map));
    // console.log(`Saved ${dest.path}`);
}