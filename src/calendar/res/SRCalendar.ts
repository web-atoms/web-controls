import DISingleton from "@web-atoms/core/dist/di/DISingleton";

@DISingleton({
    inject: "./{lang}/SRCalendar"
})
export default abstract class SRCalendar {

    public abstract get monthList(): any;

    public abstract get weekDays(): any;

    public toShortDate(d: Date): string {
        return d.toLocaleDateString();
    }

}
