import XNode from "@web-atoms/core/dist/core/XNode";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import AtomToggleView, { ToggleView } from "../../toggle-view/AtomToggleView";
import styled from "@web-atoms/core/dist/style/styled";

const css = styled.css `
    display: flex;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px; 

    `.installLocal();

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
