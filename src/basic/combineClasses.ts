export default function combineClasses(... names: string[]) {
    return names.filter((n) => n).join(" ");
}
