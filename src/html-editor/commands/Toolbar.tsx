import XNode from "@web-atoms/core/dist/core/XNode";

import "../../styles/html-editor-toolbar.global.less";

export default function Toolbar(a: any, ... nodes: XNode[]) {
    return <div data-html-editor-element="toolbar" { ... a}>
        { ... nodes}
    </div>;
}