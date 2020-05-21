import DISingleton from "@web-atoms/core/dist/di/DISingleton";

@DISingleton({
    inject: "./{lang}/SRCalendar"
})
export default abstract class SRCalendar {

    public monthList = [
        {label: "January", value: 0},
        {label: "February", value: 1},
        {label: "March", value: 2},
        {label: "April", value: 3},
        {label: "May", value: 4},
        {label: "June", value: 5},
        {label: "July", value: 6},
        {label: "August", value: 7},
        {label: "September", value: 8},
        {label: "October", value: 9},
        {label: "November", value: 10},
        {label: "December", value: 11}
    ];

    public weekDays = [
        { label: "Mon", value: "Mon" },
        { label: "Tue", value: "Tue" },
        { label: "Wed", value: "Wed" },
        { label: "Thu", value: "Thu" },
        { label: "Fri", value: "Fri" },
        { label: "Sat", value: "Sat" },
        { label: "Sun", value: "Sun" }
    ];
    public toShortDate(d: Date): string {
        return d.toLocaleDateString();
    }

}
