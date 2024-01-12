import XNode from "@web-atoms/core/dist/core/XNode";
import styled from "@web-atoms/core/dist/style/styled";

    styled.css `
        height: 5px;
        & > * {
            position: absolute;
            left: 0;
            top: 0;
        }
    `.installGlobal("*[data-track-progress=track-progress]");

export default function TrackProgress(a) {
    return <div
        data-track-progress="track-progress">
        <div class="available"/>
        <div class="done"/>
        <div class="thumb"/>
    </div>;
}