const get = (start, path: string) => {
    let item = start;
    for (const iterator of path.split(".")) {
        if (iterator === "$") {
            item = start;
        }
        item = item[iterator];
    }
    return item;
}

function* getFragments(path: string) {
    const regex = /([^\=\:]+)\s*[\=\:]\s*((('[^\\']*(((\\')|(''))[^\\']*)*')|("[^\\"]*(((\\")|(""))[^\\"]*)*"))|([^\,\;]+))\s*[\,\;]?\s*/gmi;

    // Alternative syntax using RegExp constructor
    // const regex = new RegExp('(([^\\=\\:]+)\\s*[\\=\\:]\\s*(([^\\,]+)|(\'[^\\\\\']*(((\\\\\')|(\'\'))[^\\\\\']*)*\')|("[^\\\\"]*(((\\\\")|(""))[^\\\\"]*)*")))[\\,\\;]?\\s*', 'gmi')

    let m;

    while ((m = regex.exec(path)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        yield [m[1].trim(), m[2].trim()]
    
    }
}

export default class ItemPath {

    public static get(item, path: string) {
        if (path.startsWith("$.")) {
            return get(item, path);
        }
        if (/^[\{\"]/.test(path)) {
            // it is a valid json..
            const json = JSON.parse(path);

            // should we have some sort of json embedding??

            return json;
        }
        const target = {};
        return this.build(item, path, target);
    }

    public static build(item, path: string, target: any) {
        for (let [key, value] of getFragments(path)) {
            if (value.startsWith("$")) {
                value = get(item, value);
                target[key] = value;
                continue;
            }
            if (value.startsWith('"')) {
                value = JSON.parse(value);
                target[key] = value;
                continue;
            }
            if (value.startsWith("'")) {
                value = value.substring(1, value.length - 1);
                value = value.replace(/((\'\')|(\\\'))/, "'");
                target[key] = value;
                continue;
            }

            // these values are purposely compared
            // at end because they will be used rarly
            if (value === "true") {
                target[key] = true;
                continue;
            }
            if (value === "false") {
                target[key] = false;
                continue;
            }
            if (value === "null") {
                target[key] = null;
                continue;
            }
            target[key] = Number(value);
        }
    }

}