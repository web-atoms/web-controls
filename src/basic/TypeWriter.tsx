import XNode from "@web-atoms/core/dist/core/XNode";
import sleep from "@web-atoms/core/dist/core/sleep";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import styled from "@web-atoms/core/dist/style/styled";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";

    styled.css `
    display: inline-flex;
    align-items: center;
    justify-content: start;
    white-space: nowrap;
    padding-right: 1px;
    border-right-style: solid;
    border-right-width: 2px;
    border-right-color: currentColor;
`.installGlobal("[data-component=type-writer]");

const disposableProperty = Symbol("type-writer-timer");

const nbsp = "\u202f";

const tp = AtomControl.registerProperty("data-type-writer","type-writer", (c, e, value) => {

    e[disposableProperty]?.cancel();

    const ct = new CancelToken();
    e[disposableProperty] = ct;
    c.app.runAsync(async () => {

        const separator = e.getAttribute("separator") ?? e.getAttribute("data-separator") ?? ",";

        const typeDelay = Number(e.getAttribute("type-delay") ?? e.getAttribute("data-type-delay") ?? "180");

        const pause = Number(e.getAttribute("pause") ?? e.getAttribute("data-pause") ?? "700");

        const deleteDelay = Number(e.getAttribute("delete-delay") ?? e.getAttribute("data-delete-delay") ?? "100");

        const textList = value
            .split(separator)
            .map((x) => x.trim())
            .filter((x) => x);

        e.textContent = nbsp;

        let index = 0;
        const max = textList.length;


        while(!ct.cancelled) {
            if (!e.isConnected) {
                return;
            }
            const current = textList[index];

            let length = 0;

            // forward...
            while(length < current.length) {
                e.textContent = current.substring(0, ++length) || nbsp;
                await sleep(typeDelay);
            }

            await sleep(pause);

            while(length) {
                e.textContent = current.substring(0, --length) || nbsp;
                await sleep(deleteDelay);
            }

            await sleep(deleteDelay);

            index++;
            if (index === max) {
                index = 0;
            }
        }
    });
});

export default function TypeWriter({ text, ... a}) {
    return <div
        data-component="type-writer"
        { ... tp(text)}
        { ... a}></div>;
}