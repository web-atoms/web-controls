import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomToggleView, { ToggleView } from "../../toggle-view/AtomToggleView";

@Pack
export default class ToggleViewTest extends AtomControl {

    protected create(): void {
        this.render(<div>
            <AtomToggleView>
                <ToggleView label="First">
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
