import XNode from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";

const separatorCss = styled.css `
    background-color: #a9a9a9;
    margin-left: 4px;
    margin-right: 4px;
    display: inline-block;
    margin-top: 4px;
    height: 1rem;
    width: 2px;
    padding: 0;
    `.installLocal();

export default function Separator() {
    return <div class={separatorCss}></div>;
}
