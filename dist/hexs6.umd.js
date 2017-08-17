(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.hexs6 = {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
function Point(x, y) {
    return { x: x, y: y };
}

/**
 * Named generator for the expected hex javascript object, which holds a hex's co-ors in cubed format
 * These serve as both coordinate and vector in the hex plane, allowing them to be scaled, etc
 * @param q 
 * @param r 
 * @param s 
 */
function Hex(q, r, s) {
    return { q: q, r: r, s: s };
}

/**
 * Outputs the hex in a sensible, consistent string format. Useful for logging and hashing.
 * @param hex 
 */
function hex_stringify(hex) {
    return "q:" + hex.q + "|r:" + hex.r + "|s:" + hex.s;
}

/**
 * Named Generator for an Axial coordinate, just another name for Point at the end of the day, but self-documenting code, yo
 * @param x 
 * @param z 
 */






/**
 * Hex Coordinate system addition
 * @param a 1st Hex
 * @param b 2nd Hex
 */
function hex_add(a, b) {
    return Hex(a.q + b.q, a.r + b.r, a.s + b.s);
}

/**
 * Hex Coordinate system subtration
 * @param a 1st Hex
 * @param b 2nd Hex
 */
function hex_subtract(a, b) {
    return Hex(a.q - b.q, a.r - b.r, a.s - b.s);
}

/**
 * Hex Coordinate system scaling
 * @param a Hex
 * @param k Scalar
 */


var hex_directions = [Hex(1, 0, -1), Hex(0, 1, -1), Hex(-1, 1, 0), Hex(-1, 0, 1), Hex(0, -1, 1), Hex(1, -1, 0)];
var hex_direction_names_horizontal = ["East", "NorthEast", "NorthWest", "West", "SouthWest", "SouthEast"];
var normalized_horizontal_names = hex_direction_names_horizontal.map(function (d) {
    return d.toLowerCase();
});
var hex_direction_names_vertical = ["NorthEast", "North", "NorthWest", "SouthWest", "South", "SouthEast"];
var normalized_vertical_names = hex_direction_names_vertical.map(function (d) {
    return d.toLowerCase();
});

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
function hex_direction(direction) {
    var horizontal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    if ((typeof direction === "undefined" ? "undefined" : _typeof(direction)) === _typeof("string")) {
        var index = void 0;
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
function hex_rotate_left(rotation_origin) {
    var center = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Hex(0, 0, 0);

    var vector = hex_subtract(rotation_origin, center);
    var rotated = Hex(-vector.r * 1, -vector.s * 1, -vector.q * 1);
    return hex_add(rotated, center);
}

/*       [ x=q,  y=r,  z=s]
to        [-y=-r, -z=-s, -x=-q]

[ x,  y,  z]
to  [-z, -x, -y]
 */
function hex_rotate_right(rotation_origin) {
    var center = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Hex(0, 0, 0);

    var vector = hex_subtract(rotation_origin, center);
    var rotated = Hex(-vector.s * 1, -vector.q * 1, -vector.r * 1);
    return hex_add(rotated, center);
}

/**
 * 
 * @param hex position
 * @param direction 
 */
function hex_neighbor(hex, direction) {
    return hex_add(hex, hex_direction(direction));
}

/**
 * TODO: Larger than 1 cycle //TODO: Brain fart?! Yeah, this doesn't touch an actual map. Dur. Brain needs retool.
 * @param hex center hex
 */
function hex_neighbors(hex) {
    return hex_directions.map(function (direction) {
        return hex_add(hex, direction);
    });
}

var hex_diagonals = [Hex(2, -1, -1), Hex(1, -2, 1), Hex(-1, -1, 2), Hex(-2, 1, 1), Hex(-1, 2, -1), Hex(1, 1, -2)];
function hex_diagonal_neighbor(hex, direction) {
    return hex_add(hex, hex_diagonals[direction]);
}

function hex_length(hex) {
    return Math.trunc((Math.abs(hex.q) + Math.abs(hex.r) + Math.abs(hex.s)) / 2);
}

function hex_distance(a, b) {
    return hex_length(hex_subtract(a, b));
}

function hex_round(h) {
    var q = Math.trunc(Math.round(h.q));
    var r = Math.trunc(Math.round(h.r));
    var s = Math.trunc(Math.round(h.s));
    var q_diff = Math.abs(q - h.q);
    var r_diff = Math.abs(r - h.r);
    var s_diff = Math.abs(s - h.s);
    if (q_diff > r_diff && q_diff > s_diff) {
        q = -r - s;
    } else if (r_diff > s_diff) {
        r = -q - s;
    } else {
        s = -q - r;
    }
    return Hex(q + +0, r + +0, s + +0); //BUGFIX: ES6 negative 0 was causing tests to fail, could cause weird bugs for someone someday?
    //This also fixed the order issues I was seeing, so no sort needed? -- HT
}

function hex_lerp(a, b, t) {
    return Hex(a.q * (1 - t) + b.q * t, a.r * (1 - t) + b.r * t, a.s * (1 - t) + b.s * t);
}

function hex_linedraw(a, b) {
    var N = hex_distance(a, b);
    var a_nudge = Hex(a.q + 0.000001, a.r + 0.000001, a.s - 0.000002);
    var b_nudge = Hex(b.q + 0.000001, b.r + 0.000001, b.s - 0.000002);
    var results = [];
    var step = 1.0 / Math.max(N, 1);
    for (var i = 0; i <= N; i++) {
        results.push(hex_round(hex_lerp(a_nudge, b_nudge, step * i)));
    }
    return results;
}

function OffsetCoord(col, row) {
    return { col: col, row: row };
}

var EVEN = 1;
var ODD = -1;
function qoffset_from_cube(offset, h) {
    var col = h.q;
    var row = h.r + Math.trunc((h.q + offset * (h.q & 1)) / 2);
    return OffsetCoord(col, row);
}

function qoffset_to_cube(offset, h) {
    var q = h.col;
    var r = h.row - Math.trunc((h.col + offset * (h.col & 1)) / 2);
    var s = -q - r;
    return Hex(q, r, s);
}

function roffset_from_cube(offset, h) {
    var col = h.q + Math.trunc((h.r + offset * (h.r & 1)) / 2);
    var row = h.r;
    return OffsetCoord(col, row);
}

function roffset_to_cube(offset, h) {
    var q = h.col - Math.trunc((h.row + offset * (h.row & 1)) / 2);
    var r = h.row;
    var s = -q - r;
    return Hex(q, r, s);
}

function Orientation(f0, f1, f2, f3, b0, b1, b2, b3, start_angle) {
    return { f0: f0, f1: f1, f2: f2, f3: f3, b0: b0, b1: b1, b2: b2, b3: b3, start_angle: start_angle };
}

/**
 * TODO: Docs
 * @param orientation 
 * @param size 
 * @param origin 
 */
function Layout(orientation, size, origin) {
    return { orientation: orientation, size: size, origin: origin };
}

var layout_pointy = Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);
var layout_flat = Orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0);
function hex_to_pixel(layout, h) {
    var M = layout.orientation;
    var size = layout.size;
    var origin = layout.origin;
    var x = (M.f0 * h.q + M.f1 * h.r) * size.x;
    var y = (M.f2 * h.q + M.f3 * h.r) * size.y;
    return Point(x + origin.x, y + origin.y);
}

function pixel_to_hex(layout, p) {
    var M = layout.orientation;
    var size = layout.size;
    var origin = layout.origin;
    var pt = Point((p.x - origin.x) / size.x, (p.y - origin.y) / size.y);
    var q = M.b0 * pt.x + M.b1 * pt.y;
    var r = M.b2 * pt.x + M.b3 * pt.y;
    return Hex(q, r, -q - r);
}

var _marked = /*#__PURE__*/regeneratorRuntime.mark(traverse_hex_cells);

function string_hash_code(string) {
    var hash = 0;
    if (string.length == 0) return hash;
    for (var i = 0; i < string.length; i++) {
        var char = string.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

function hex_hash(hex) {
    return string_hash_code(hex_stringify(hex));
}

function store_hex(hex, map) {
    map[hex_hash(hex)] = hex;
}

function get_hex(hex, map) {
    return map[hex_hash(hex)];
}

function hexmap_values(hexmap) {
    return Object.keys(hexmap).map(function (k) {
        return hexmap[k];
    });
}

function hexmap_neighbors(hex, map) {
    return hex_neighbors(hex).map(function (neighborPos) {
        return get_hex(neighborPos, map);
    }).filter(function (n) {
        return !!n;
    });
}

function hex_array_to_map_reducer(map, currentArrayItem) {
    store_hex(currentArrayItem, map);
    return map;
}



function traverse_hex_cells(radius) {
    var q, start, end, r, hex;
    return regeneratorRuntime.wrap(function traverse_hex_cells$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    radius = parseInt(radius);
                    q = -radius;

                case 2:
                    if (!(q <= radius)) {
                        _context.next = 16;
                        break;
                    }

                    start = Math.max(-radius, -q - radius);
                    end = Math.min(radius, -q + radius);
                    r = start;

                case 6:
                    if (!(r <= end)) {
                        _context.next = 13;
                        break;
                    }

                    hex = Hex(q, r, -q - r);
                    _context.next = 10;
                    return hex;

                case 10:
                    r++;
                    _context.next = 6;
                    break;

                case 13:
                    q++;
                    _context.next = 2;
                    break;

                case 16:
                case "end":
                    return _context.stop();
            }
        }
    }, _marked, this);
}

function create_hex_cells(radius) {
    var map = new Array();
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = traverse_hex_cells(radius)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var pos = _step.value;

            map.push(pos);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return map;
}



function wraparound_mirror_centers(radius) {
    var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Hex(0, 0, 0);

    var offsets = [origin, hex_add(origin, Hex(2 * radius + 1, -radius, -radius - 1))];
    while (offsets.length < 7) {
        var prev = offsets[offsets.length - 1];
        offsets.push(hex_rotate_right(prev));
    }
    return offsets;
}

//Oh, right! Fixed! Please use!
function wraparound_bounds(position, radius) {
    var centers = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : wraparound_mirror_centers(radius);
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = centers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var offset = _step2.value;

            var distance = hex_distance(position, offset);
            var check = distance <= radius;
            if (check) {
                return hex_subtract(position, offset);
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    console.error("\nUnable to find any center we're less than a radius away from?!\nPlease check your passed in centers.");
    return undefined;
}

function hexmap_wraparound_neighbors(hex, map, mirrors) {
    return hex_neighbors(hex).map(function (neighborPos) {
        var realPos = wraparound_bounds(neighborPos, map.radius, mirrors);
        if (realPos != neighborPos) {
            console.log("We shifted off the board?", neighborPos, realPos);
        }
        return get_hex(realPos, map);
    }).filter(function (n) {
        return !!n;
    });
}

exports.EVEN = EVEN;
exports.Hex = Hex;
exports.hex_add = hex_add;
exports.hex_diagonal_neighbor = hex_diagonal_neighbor;
exports.hex_direction = hex_direction;
exports.hex_distance = hex_distance;
exports.hex_lerp = hex_lerp;
exports.hex_linedraw = hex_linedraw;
exports.hex_neighbor = hex_neighbor;
exports.hex_round = hex_round;
exports.hex_subtract = hex_subtract;
exports.hex_rotate_left = hex_rotate_left;
exports.hex_rotate_right = hex_rotate_right;
exports.hex_to_pixel = hex_to_pixel;
exports.Layout = Layout;
exports.layout_flat = layout_flat;
exports.layout_pointy = layout_pointy;
exports.ODD = ODD;
exports.OffsetCoord = OffsetCoord;
exports.pixel_to_hex = pixel_to_hex;
exports.Point = Point;
exports.qoffset_from_cube = qoffset_from_cube;
exports.qoffset_to_cube = qoffset_to_cube;
exports.roffset_from_cube = roffset_from_cube;
exports.roffset_to_cube = roffset_to_cube;
exports.hex_directions = hex_directions;
exports.hex_stringify = hex_stringify;
exports.hex_direction_names_horizontal = hex_direction_names_horizontal;
exports.hex_direction_names_vertical = hex_direction_names_vertical;
exports.create_hex_cells = create_hex_cells;
exports.hexmap_wraparound_neighbors = hexmap_wraparound_neighbors;
exports.wraparound_mirror_centers = wraparound_mirror_centers;
exports.wraparound_bounds = wraparound_bounds;
exports.hex_array_to_map_reducer = hex_array_to_map_reducer;
exports.hex_hash = hex_hash;
exports.store_hex = store_hex;
exports.get_hex = get_hex;
exports.hexmap_values = hexmap_values;
exports.hexmap_neighbors = hexmap_neighbors;

Object.defineProperty(exports, '__esModule', { value: true });

})));
