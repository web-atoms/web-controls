import type { App } from "@web-atoms/core/dist/App";
import Bind from "@web-atoms/core/dist/core/Bind";
import Colors from "@web-atoms/core/dist/core/Colors";
import FormattedString from "@web-atoms/core/dist/core/FormattedString";
import { CancelToken } from "@web-atoms/core/dist/core/types";
import XNode from "@web-atoms/core/dist/core/XNode";
import { NavigationService } from "@web-atoms/core/dist/services/NavigationService";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import PopupService, { PopupWindow } from "@web-atoms/core/dist/web/services/PopupService";
import CSS from "@web-atoms/core/dist/web/styles/CSS";

export interface IFormField {
    label: string;
    required?: boolean;
    error?: string;
    class?: string;
    helpIcon?: string | boolean;
    help?: string | object;
    helpEventClick?: any;
    /**
     * Tooltip displayed on help icon
     */
    helpTitle?: string;
    [key: string]: any;
}

const css = CSS(StyleRule()
    .verticalFlexLayout({ alignItems: "stretch"})
    .child(StyleRule(".field-error")
        .padding(5)
        .margin(5)
        .borderRadius(9999)
        .backgroundColor(Colors.red)
        .color(Colors.white)
        .fontSize("smaller")
        .and(StyleRule(":empty")
            .display("none")
        )
    )
    .child(StyleRule(".label")
        .child(StyleRule(".true")
            .visibility("visible")
            .color(Colors.red)
        )
        .child(StyleRule(".required")
            .visibility("hidden")
        )
        .child(StyleRule("i")
            .cursor("pointer")
            .marginLeft(5)
        )
    )
, "div[data-wa-form-field=wa-form-field]");

const helpCSS = CSS(StyleRule()
    .padding(10)
    .child(StyleRule(".fad")
        .absolutePosition({ top: 5, right: 5 })
    )
);

export default function FormField(
    {
        label,
        required,
        error,
        helpIcon = "fad fa-question-circle",
        help,
        helpEventClick,
        helpTitle,
        ... others
    }: IFormField,
    node: XNode) {

    if (!helpEventClick && help) {
        helpEventClick = Bind.event((s, e) => {
            const app = s.app as App;
            if (typeof help === "string" || help instanceof FormattedString) {
                const ns = app.resolve(NavigationService);
                ns.notify(help);
                return;
            }

            const cancelToken = new CancelToken();

            class HelpPopup extends AtomControl {
                protected create(): void {
                    this.render(<div class={helpCSS}>
                        <i
                            class="fad fa-times-circle"
                            eventClick={() => cancelToken.cancel()}
                            />
                        { help as any}
                    </div>);
                }
            }
            const hp = new HelpPopup(app);
            PopupService.show(s.element as any, hp.element, { alignment: "centerOfScreen", cancelToken });
        });
    }

    return <div data-wa-form-field="wa-form-field" { ... others }>
        <div class="label">
            <label text={label}/>
            <span class="required" styleClass={required} text="*" />
            { help ? <i class={helpIcon} title={helpTitle} eventClick={helpEventClick}/> : undefined }
        </div>
        { node }
        <div class="field-error" text={error}/>
    </div>;
}
