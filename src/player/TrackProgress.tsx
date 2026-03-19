import XNode from "@web-atoms/core/dist/core/XNode.js";

import "../styles/track-progress.global.css";

export default function TrackProgress(a) {
    return <div
        data-track-progress="track-progress">
        <div class="available"/>
        <div class="done"/>
        <div class="thumb"/>
    </div>;
}