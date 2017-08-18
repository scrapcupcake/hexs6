/**
 * Hexs6
 * Updated and Curated by Hunnie Tana
 * Based on excellent documentation and Generated Code -- http://www.redblobgames.com/grids/hexagons/
 */

/**
 * Named generator for the expected hex javascript object, which holds a hex's co-ors in cubed format
 * These serve as both coordinate and vector in the hex plane, allowing them to be scaled, etc
 * @param q 
 * @param r 
 * @param s 
 */
export function Hex(q, r, s) {
    return { q, r, s };
}

/**
 * Outputs the hex in a sensible, consistent string format. Useful for logging and hashing.
 * @param hex 
 */
export function hex_stringify(hex) {
    return `q:${hex.q}|r:${hex.r}|s:${hex.s}`;
}

/**
 * Hex Coordinate system addition
 * @param a 1st Hex
 * @param b 2nd Hex
 */
export function hex_add(a, b) {
    return Hex(a.q + b.q, a.r + b.r, a.s + b.s);
}

/**
 * Hex Coordinate system subtration
 * @param a 1st Hex
 * @param b 2nd Hex
 */
export function hex_subtract(a, b) {
    return Hex(a.q - b.q, a.r - b.r, a.s - b.s);
}

/**
 * Hex Coordinate system scaling
 * @param a Hex
 * @param k Scalar
 */
export function hex_scale(a, k) {
    return Hex(a.q * k, a.r * k, a.s * k);
}


export const hex_directions = [Hex(1, 0, -1), Hex(0, 1, -1), Hex(-1, 1, 0), Hex(-1, 0, 1), Hex(0, -1, 1), Hex(1, -1, 0)];
export const hex_direction_names_horizontal = ["East",  "SouthEast", "SouthWest", "West",  "NorthWest", "NorthEast"];
const normalized_horizontal_names = hex_direction_names_horizontal.map((d) => d.toLowerCase());
export const hex_direction_names_vertical = ["NorthEast", "SouthEast", "South", "SouthWest", "NorthWest", "North"];
const normalized_vertical_names = hex_direction_names_vertical.map((d) => d.toLowerCase());

/**
 * Resolve hex directions consistently, either by integer index or name string.
 * Names default to Horizontal aka Pointy Top orientation
 * Index Order: [Hex(1, 0, -1), Hex(0, 1, -1), Hex(-1, 1, 0), Hex(-1,0,1),Hex(0,-1,1),Hex(1,-1,-0)];
 * Horizontal:  ["East",  "NorthEast", "NorthWest", "West",  "SouthEast", "SouthWest"]
 * Vertical:    ["NorthEast", "North", "NorthWest", "SouthWest", "South", "SouthEast"]
 * TODO: Case insensitivity
 * @param direction String or Index
 * @param horizontal Boolean, false uses vertical names
 */
export function hex_direction(direction, horizontal = true) {
    if (typeof(direction) === typeof("string")) {
        let index;
        if (horizontal) {
            index = normalized_horizontal_names.indexOf(direction.toLowerCase());
        } else {
            index = normalized_vertical_names.indexOf(direction.toLowerCase());
        }
        return index > -1 ? hex_directions[index] : undefined;
    }

    return hex_directions[direction];
}


/*
[ x=q,  y=r,  z=s]
to        [-r, -s, -q]
 */
export function hex_rotate_left(rotation_origin, center = Hex(0, 0, 0)) {
    let vector = hex_subtract(rotation_origin, center);
    let rotated = Hex(-vector.r * 1, -vector.s * 1, -vector.q * 1);
    return hex_add(rotated, center);
}

/*       [ x=q,  y=r,  z=s]
to        [-y=-r, -z=-s, -x=-q]

[ x,  y,  z]
to  [-z, -x, -y]
 */
export function hex_rotate_right(rotation_origin, center = Hex(0, 0, 0)) {
    let vector = hex_subtract(rotation_origin, center);
    let rotated = Hex(-vector.s * 1, -vector.q * 1, -vector.r * 1);
    return hex_add(rotated, center);
}

/**
 * 
 * @param hex position
 * @param direction 
 */
export function hex_neighbor(hex, direction, horizontal=true) {
    return hex_add(hex, hex_direction(direction,horizontal));
}

/**
 * TODO: Larger than 1 cycle //TODO: Brain fart?! Yeah, this doesn't touch an actual map. Dur. Brain needs retool.
 * @param hex center hex
 */
export function hex_neighbors(hex) {
    return hex_directions.map((direction) => { return hex_add(hex, direction); });
}


let hex_diagonals =                 [Hex(2, -1, -1), Hex(1, -2, 1), Hex(-1, -1, 2), Hex(-2, 1, 1), Hex(-1, 2, -1), Hex(1, 1, -2)];
let hex_diagonal_names_horizontal = ["NorthEast",    "North",       "NorthWest",    "SouthWest",   "South",        "SouthEast"  ];
let hex_diagonal_names_vertical =   ["NorthEast",    "NorthWest",   "West",         "SouthWest",   "SouthEast",    "East"       ];
export function hex_diagonal_neighbor(hex, direction) {
    return hex_add(hex, hex_diagonals[direction]);
}

export function hex_length(hex) {
    return Math.trunc((Math.abs(hex.q) + Math.abs(hex.r) + Math.abs(hex.s)) / 2);
}

export function hex_distance(a, b) {
    return hex_length(hex_subtract(a, b));
}

export function hex_round(h) {
    let q = Math.trunc(Math.round(h.q));
    let r = Math.trunc(Math.round(h.r));
    let s = Math.trunc(Math.round(h.s));
    let q_diff = Math.abs(q - h.q);
    let r_diff = Math.abs(r - h.r);
    let s_diff = Math.abs(s - h.s);
    if (q_diff > r_diff && q_diff > s_diff) {
        q = -r - s;
    } else
    if (r_diff > s_diff) {
        r = -q - s;
    } else {
        s = -q - r;
    }
    return Hex(q + +0, r + +0, s + +0); //BUGFIX: ES6 negative 0 was causing tests to fail, could cause weird bugs for someone someday?
    //This also fixed the order issues I was seeing, so no sort needed? -- HT
}

export function hex_lerp(a, b, t) {
    return Hex(a.q * (1 - t) + b.q * t, a.r * (1 - t) + b.r * t, a.s * (1 - t) + b.s * t);
}

export function hex_linedraw(a, b) {
    let N = hex_distance(a, b);
    let a_nudge = Hex(a.q + 0.000001, a.r + 0.000001, a.s - 0.000002);
    let b_nudge = Hex(b.q + 0.000001, b.r + 0.000001, b.s - 0.000002);
    let results = [];
    let step = 1.0 / Math.max(N, 1);
    for (let i = 0; i <= N; i++) {
        results.push(hex_round(hex_lerp(a_nudge, b_nudge, step * i)));
    }
    return results;
}