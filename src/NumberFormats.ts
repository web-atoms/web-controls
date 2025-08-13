const k = 1000;
const m = k*k;
const b = m*k;

const kb = 1024;
const mb = kb*kb;
const gb = mb*kb;
const tb = gb*kb;
const pb = tb*kb;

export const toCompactFixed = (n: number, decimals: number) => {
    let text = n.toFixed(decimals);
    if (decimals > 0){
        while(text.endsWith("0")) {
            text = text.substring(0, text.length - 1);
        }
        if (text.endsWith(".")) {
            text = text.substring(0, text.length - 1);
        }
    }
    return text;
};

export const toKMBString = (n: number, decimals = 0,  def = "") => {
    if (!n) {
        return def + "";
    }
    if (typeof n === "string") {
        n = Number(n);
    }
    if (n >= b) {
        return toCompactFixed((n/b), decimals) + "B";
    }
    if (n >= m) {
        return toCompactFixed((n / m), decimals) + "M";
    }
    if (n >= k) {
        return toCompactFixed((n / k), decimals) + "K";
    }
    return toCompactFixed(n, 0);
};

export const toFileSize = (n: number, decimals = 0,  def = "") => {
    n = Number(n);
    if (n === 0) {
        return "0 B";
    }
    if (!n) {
        return def + "";
    }
    if (n >= pb) {
        return toCompactFixed((n/pb), decimals) + " PB";
    }
    if (n >= tb) {
        return toCompactFixed((n/tb), decimals) + " TB";
    }
    if (n >= gb) {
        return toCompactFixed((n/gb), decimals) + " GB";
    }
    if (n >= mb) {
        return toCompactFixed((n / mb), decimals) + " MB";
    }
    if (n >= kb) {
        return toCompactFixed((n / kb), decimals) + " KB";
    }
    return toCompactFixed(n, 0);
};

export interface IFormat {
    prefix: string;
    suffix: string;
    numberToText?: (n: number) => string;
}

export const formatNumber = (n: number, {
    prefix = "",
    suffix = "",
    def = "",
    numberToText = toKMBString} = {}) => {
    if (!n) {
        return def;
    }
    const text = numberToText(n);
    return prefix + text + suffix;
};
