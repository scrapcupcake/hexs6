import {Hex} from './index';

export function OffsetCoord(col, row) {
    return { col: col, row: row };
}

export const EVEN = 1;
export const ODD = -1;
export function qoffset_from_cube(offset, h) {
    let col = h.q;
    let row = h.r + Math.trunc((h.q + offset * (h.q & 1)) / 2);
    return OffsetCoord(col, row);
}

export function qoffset_to_cube(offset, h) {
    let q = h.col;
    let r = h.row - Math.trunc((h.col + offset * (h.col & 1)) / 2);
    let s = -q - r;
    return Hex(q, r, s);
}

export function roffset_from_cube(offset, h) {
    let col = h.q + Math.trunc((h.r + offset * (h.r & 1)) / 2);
    let row = h.r;
    return OffsetCoord(col, row);
}

export function roffset_to_cube(offset, h) {
    let q = h.col - Math.trunc((h.row + offset * (h.row & 1)) / 2);
    let r = h.row;
    let s = -q - r;
    return Hex(q, r, s);
}