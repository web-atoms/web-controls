(() => {

    let script = document.currentScript;
    let src = script.src;
    let index = src.lastIndexOf("/");
    src = src.substring(0, index);

    const loadScript = (url) => {
        return new Promise((resolve, reject) => {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            var s = script;
            s.onerror = function (e) {
                alert(`Script ${url} failed to load`);
                console.error(`${url} failed to load ${e.stack || e}`);
                reject(e);
            };
            s.onload = s.onreadystatechange = function () {
            if ((s.readyState && s.readyState !== "complete" && s.readyState !== "loaded")) {
                console.error("error loading " + url);
                reject(`error loading ${url}`);
                return;
            }
            s.onload = s.onreadystatechange = null;
                resolve();
                s.remove();
            };
            document.body.appendChild(s);
        });
    };

    const loadPackage = () => {

        let package = script.getAttribute("data-package");
        let packageRoot = script.getAttribute("data-package-root");
        if (packageRoot === void 0 || packageRoot === null) {
            packageRoot = src;
        }
        if (!package) {
            fetch(src + "/package.json").then((x) => x.json().then((json) => {
                script.setAttribute("data-package", json.name);
                loadPackage();
            }));
            return;
        }

        const view = script.getAttribute("data-view");

        const packed = JSON.parse(script.getAttribute("data-packed") ?? "true");
        const min = JSON.parse(script.getAttribute("data-min") ?? "true");
        const viewName = view.startsWith("@") ? view : `${package}/${view}`;

        const init = ()  => {
            function empty () {
                return function () {
                    return null
                }
            }
    
            AmdLoader.moduleProgress = empty;
            function done () {
                const we = document.getElementById("webAtomsLoader");
                if (we) {
                    we.remove();
                }
            };
            UMD.setupRoot(package, packageRoot);
            UMD.lang = "en-US";
            const map = script.getAttribute("data-map");
            if (map) {
                try {
                    for (const [key, value] of JSON.parse(map)) {
                        UMD.map(key, value);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            UMD.loadView(viewName, 0).then(done);
        }

        if (!packed) {
            init();
            return;
        }

        const viewUrl = `${packageRoot}/${view}${packed ? ".pack" : ""}${min ? ".min" : ""}.js`;
        loadScript(viewUrl).then(init);
    };

    loadPackage();
})();