import Bind from "@web-atoms/core/dist/core/Bind.js";
import XNode from "@web-atoms/core/dist/core/XNode.js";
import DISingleton from "@web-atoms/core/dist/di/DISingleton.js";
import Pack from "@web-atoms/core/dist/Pack.js";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl.js";
import DateTime from "@web-atoms/date-time/dist/DateTime.js";
import InjectProperty from "@web-atoms/core/dist/core/InjectProperty.js";
import WatchProperty from "@web-atoms/core/dist/core/WatchProperty.js";

@DISingleton()
class SomeService {

    public initTime = DateTime.now;
}

@Pack
export default class TimerTest extends AtomControl {

    public currentTime: DateTime;

    @InjectProperty
    public service: SomeService;

    @WatchProperty
    public get time() {
        return this.currentTime;
    }

    protected create(): void {
        this.currentTime = DateTime.now;

        this.render(<div>
            <div text={Bind.oneWay(() => this.time)}/>
            <div text={this.service.initTime}/>
        </div>)

        const id = setInterval(() => {
            this.currentTime = DateTime.now;
        }, 1000);
        this.registerDisposable({
            dispose() {
                clearInterval(id);
            }
        });
    }
}
