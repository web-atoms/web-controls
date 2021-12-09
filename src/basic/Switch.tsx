import XNode from "@web-atoms/core/dist/core/XNode";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

/**
 * Original source = https://www.htmllion.com/css3-toggle-switch-button.html
 */

const css = CSS(StyleRule()
	.position("relative")
	.display("inline-block")
	.verticalAlign("top")
	.width(70)
	.height(30)
	.padding(3)
	.margin("0 10px 10px 0")
	.background("linear-gradient(to bottom, #eeeeee, #FFFFFF 25px)" as any)
	.backgroundImage("-webkit-linear-gradient(top, #eeeeee, #FFFFFF 25px)")
	.borderRadius(18)
	.boxShadow("inset 0 -1px white, inset 0 1px 1px rgba(0, 0, 0, 0.05)")
	.cursor("pointer")
	.boxSizing("content-box")
	.child(StyleRule(".switch-input")
		.absolutePosition({ top: 0, left: 0})
		.opacity(0 as any)
		.boxSizing("content-box")
	)
	.child(StyleRule(".switch-label")
		.position("relative")
		.display("block")
		.height("inherit")
		.fontSize(10)
		.textTransform("uppercase")
		.backgroundColor("#eceeef")
		.borderRadius("inherit")
		.boxShadow("inset 0 1px 2px rgba(0, 0, 0, 0.12), inset 0 0 2px rgba(0, 0, 0, 0.15)")
		.boxSizing("content-box")
		.and(StyleRule(":before, .switch-label:after")
			.position("absolute")
			.top("50%")
			.marginTop("-.5em")
			.lineHeight("1")
			.webkitTransition("inherit")
			.transition("inherit")
			.boxSizing("content-box")
		)
		.and(StyleRule(":before")
			.content("attr(data-off)" as any)
			.right(11)
			.color("#aaaaaa")
			.textShadow("0 1px rgba(255, 255, 255, 0.5)")
		)
		.and(StyleRule(":after")
			.content("attr(data-on)" as any)
			.left(11)
			.color("#FFFFFF")
			.textShadow("0 1px rgba(0, 0, 0, 0.2)")
			.opacity("0")
		)
	)
	.child(StyleRule(".switch-input:checked ~ .switch-label")
		.backgroundColor("#E1B42B")
		.boxShadow("inset 0 1px 2px rgba(0, 0, 0, 0.15), inset 0 0 3px rgba(0, 0, 0, 0.2)")
	)
	.child(StyleRule(".switch-input:checked ~ .switch-label:before")
		.opacity("0")
	)
	.child(StyleRule(".switch-input:checked ~ .switch-label:after")
		.opacity("1")
	)
	.child(StyleRule(".switch-handle")
		.absolutePosition({top: 4, left: 4, width: 28, height: 28})
		.background("linear-gradient(to bottom, #FFFFFF 40%, #f0f0f0)" as any)
		.borderRadius("100%")
		.boxShadow("1px 1px 5px rgba(0, 0, 0, 0.2)")
		.and(StyleRule(":before")
			.content("")
			.absolutePosition({ top: "50%", left: "50%", width: 12, height: 12 })
			.background("linear-gradient(to bottom, #eeeeee, #FFFFFF)" as any)
			.borderRadius(6)
			.boxShadow("inset 0 1px rgba(0, 0, 0, 0.02)")
		)
	)
	.child(StyleRule(".switch-input:checked ~ .switch-handle")
		.left(44)
		.boxShadow("-1px 1px 5px rgba(0, 0, 0, 0.2)")
	)
	.child(StyleRule(".switch-label, .switch-handle")
		.transition("All 0.3s ease")
	)
);

export interface ISwitch {
	checked;
	onLabel?: string;
	offLabel?: string;
}

export default function Switch({
	checked,
	onLabel,
	offLabel
}: ISwitch) {

    return <label class={css}>
	    <input class="switch-input" type="checkbox" checked={checked} />
	    <span class="switch-label" data-on={onLabel ?? "On"} data-off={offLabel ?? "Off"}></span>
	    <span class="switch-handle"></span>
    </label>;
}
