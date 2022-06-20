import { Content } from "@data/Tournament";

export const contentList = [
    {
        key: 'menSingle',
        content: Content.MAN_SINGLE,
        label: 'Đơn nam'
    },
    {
        key: 'womenSingle',
        content: Content.WOMAN_SINGLE,
        label: 'Đơn nữ'
    },
    {
        key: 'menDouble',
        content: Content.MAN_DOUBLE,
        label: 'Đôi nam'
    },
    {
        key: 'womenDouble',
        content: Content.WOMAN_DOUBLE,
        label: 'Đôi nữ'
    },
    {
        key: 'mixedDouble',
        content: Content.MIXED_DOUBLE,
        label: 'Đôi nam/nữ'
    },
];

export const paddingTop = 55;
export const paddingLeft = 75;
export const spacing = 35;
export const size = 200;

export const formatNumber = (value: number) => {
    if(value < 10) {
        return "0" + value;
    }
    return "" + value;
}