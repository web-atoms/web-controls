export default interface IElement {
    subClass?: string;
    icon?: string;
    class?: string;
    title?: string;
    eventClick?: string;
    href?: string;
    text?: string;
    styleDisplay?: any;
    "data-click-event"?: string;
    "event-click"?: (me: MouseEvent) => any;
    [key: string]: any;
}
