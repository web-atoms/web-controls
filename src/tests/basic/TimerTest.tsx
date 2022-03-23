import Bind from "@web-atoms/core/dist/core/Bind";
import XNode from "@web-atoms/core/dist/core/XNode";
import DISingleton from "@web-atoms/core/dist/di/DISingleton";
import Pack from "@web-atoms/core/dist/Pack";
import { AtomControl } from "@web-atoms/core/dist/web/controls/AtomControl";
import DateTime from "@web-atoms/date-time/dist/DateTime";
import InjectProperty from "@web-atoms/core/dist/core/InjectProperty";
import WatchProperty from "@web-atoms/core/dist/core/WatchProperty";

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
