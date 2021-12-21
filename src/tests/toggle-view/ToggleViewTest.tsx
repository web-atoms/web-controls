import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import StyleRule from "@web-atoms/core/dist/style/StyleRule";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import CSS from "@web-atoms/core/dist/web/styles/CSS";
import AtomToggleView, { ToggleView } from "../../toggle-view/AtomToggleView";

const css = CSS(StyleRule("test")
    .display("flex")
    .absolutePosition({ top: 0, bottom: 0, right: 0, left: 0})
);

@Pack
export default class ToggleViewTest extends AtomControl {

    protected create(): void {
        this.render(<div class={css}>
            <AtomToggleView>
                <ToggleView icon="fad fa-plus" label="First">
                    <div>
                        <h3>First View</h3>
                        <div>
                            First View Content
                        </div>
                    </div>
                </ToggleView>
                <ToggleView label="Second">
                    <div>
                        <h3>Second View</h3>
                        <div>
                            Second View Content
                        </div>
                    </div>
                </ToggleView>
                <ToggleView label="Third">
                    <div>
                        <h3>Third View</h3>
                        <div>
                            Third View Content
                        </div>
                    </div>
                </ToggleView>
            </AtomToggleView>
        </div>);
    }
}
