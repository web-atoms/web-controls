import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

CSS(StyleRule()
    .height(5)
    .child(StyleRule("*")
        .position("absolute")
        .left(0)
        .top(0)
    )
, "*[data-track-progress=track-progress]");

export default function TrackProgress(a) {
    return <div
        data-track-progress="track-progress">
        <div class="available"/>
        <div class="done"/>
        <div class="thumb"/>
    </div>;
}