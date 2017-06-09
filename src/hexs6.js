/**
 * Hexs6
 * Updated and Curated by Hunnie Tana
 * Based on excellent documentation and Generated Code -- http://www.redblobgames.com/grids/hexagons/
 */

/**
 * Simple named generator for an {x,y}
 * Useful for making code more self-documenting
 * @param x 
 * @param y 
 */
export function Point(x, y) {
    return { x, y };
}

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
 * Named Generator for an Axial coordinate, just another name for Point at the end of the day, but self-documenting code, yo
 * @param x 
 * @param z 
 */
export function HexAxis(x, z) {
    return { x, z };
}

export function cube_to_axial(cube) {
    let q = cube.x
    let r = cube.z
    return HexAxis(q, r)
}

export function axial_to_cube(hex) {
    let x = hex.q
    let z = hex.r
    let y = -x - z
    return Hex(x, y, z)
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
export const hex_direction_names_horizontal = ["East",  "NorthEast", "NorthWest", "West",  "SouthWest", "SouthEast"];
const normalized_horizontal_names = hex_direction_names_horizontal.map((d) => d.toLowerCase());
export const hex_direction_names_vertical = ["NorthEast", "North", "NorthWest", "SouthWest", "South", "SouthEast"];
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
export function hex_neighbor(hex, direction) {
    return hex_add(hex, hex_direction(direction));
}

/**
 * TODO: Larger than 1 cycle //TODO: Brain fart?! Yeah, this doesn't touch an actual map. Dur. Brain needs retool.
 * @param hex center hex
 */
export function hex_neighbors(hex) {
    return hex_directions.map((direction) => { return hex_add(hex, direction); });
}


let hex_diagonals = [Hex(2, -1, -1), Hex(1, -2, 1), Hex(-1, -1, 2), Hex(-2, 1, 1), Hex(-1, 2, -1), Hex(1, 1, -2)];
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




export function Orientation(f0, f1, f2, f3, b0, b1, b2, b3, start_angle) {
    return { f0: f0, f1: f1, f2: f2, f3: f3, b0: b0, b1: b1, b2: b2, b3: b3, start_angle: start_angle };
}



/**
 * TODO: Docs
 * @param orientation 
 * @param size 
 * @param origin 
 */
export function Layout(orientation, size, origin) {
    return { orientation: orientation, size: size, origin: origin };
}

export const layout_pointy = Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);
export const layout_flat = Orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0);
export function hex_to_pixel(layout, h) {
    let M = layout.orientation;
    let size = layout.size;
    let origin = layout.origin;
    let x = (M.f0 * h.q + M.f1 * h.r) * size.x;
    let y = (M.f2 * h.q + M.f3 * h.r) * size.y;
    return Point(x + origin.x, y + origin.y);
}

export function pixel_to_hex(layout, p) {
    let M = layout.orientation;
    let size = layout.size;
    let origin = layout.origin;
    let pt = Point((p.x - origin.x) / size.x, (p.y - origin.y) / size.y);
    let q = M.b0 * pt.x + M.b1 * pt.y;
    let r = M.b2 * pt.x + M.b3 * pt.y;
    return Hex(q, r, -q - r);
}

export function hex_corner_offset(layout, corner) {
    let M = layout.orientation;
    let size = layout.size;
    let angle = 2.0 * Math.PI * (M.start_angle - corner) / 6;
    return Point(size.x * Math.cos(angle), size.y * Math.sin(angle));
}

export function polygon_corners(layout, h) {
    let corners = [];
    let center = hex_to_pixel(layout, h);
    for (let i = 0; i < 6; i++) {
        let offset = hex_corner_offset(layout, i);
        corners.push(Point(center.x + offset.x, center.y + offset.y));
    }
    return corners;
}