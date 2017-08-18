import {Hex} from './index';

/**
 * Named Generator for an Axial coordinate, just another name for Point at the end of the day, but self-documenting code, yo
 * @param x 
 * @param z 
 */
export function HexAxis(q, s) {
    return { q, s };
}

export function cube_to_axial(cube) {
    return HexAxis(cube.q, cube.s)
}

export function axial_to_cube(hex) {
    let q = hex.q
    let s = hex.s
    let r = -q - s
    return Hex(q, r, s)
}