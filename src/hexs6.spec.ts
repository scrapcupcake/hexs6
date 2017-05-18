import {
    EVEN,
    Hex,
    hex_add,
    hex_diagonal_neighbor,
    hex_direction,
    hex_distance,
    hex_lerp,
    hex_linedraw,
    hex_neighbor,
    hex_round,
    hex_subtract,
    hex_rotate_left,
    hex_rotate_right,
    hex_to_pixel,
    Layout,
    layout_flat,
    layout_pointy,
    ODD,
    OffsetCoord,
    pixel_to_hex,
    Point,
    qoffset_from_cube,
    qoffset_to_cube,
    roffset_from_cube,
    roffset_to_cube
} from './hexs6';

/**
 * Hexs6 Tests
 * 
 */

describe("Hex Arithmetic", () => {
    it("should hex add", () => {
        expect(Hex(4, -10, 6)).toEqual(hex_add(Hex(1, -3, 2), Hex(3, -7, 4)));
    });

    it("it should hex subtract", () => {
        expect(Hex(-2, 4, -2)).toEqual(hex_subtract(Hex(1, -3, 2), Hex(3, -7, 4)));
    });
});

describe("Hex Rotation", () => { 
    let center = Hex(0,0,0);

    describe("back and forth results in the same location", ()=>{
        it("at 2,-3, 1", ()=>{
            let rot = Hex(2,-3,1);
            expect(rot).toEqual(hex_rotate_right(hex_rotate_left(rot)));
        });
        it("at -4,5,-1", ()=>{
            let rot = Hex(-4,5,-1);
            expect(rot).toEqual(hex_rotate_right(hex_rotate_left(rot)));
        });    
    });

    describe("at radius 3", () => {
        let rotation_target = Hex(2,-4,2); //Q=X, R=Z, S=Y
        let rotated_right = Hex(4,-2,-2);
        let rotated_left = Hex(-2,-2, 4);

        it("should rotate right correctly", () => {
            expect(rotated_right).toEqual(hex_rotate_right(rotation_target));
        });
        it("should rotate left correctly", () => {
            expect(rotated_left).toEqual(hex_rotate_left(rotation_target));
        });
            
    });

    describe("at radius 5", () => {
        let rotation_target = Hex(-5,1,4); //Q=X, R=Z, S=Y
        let rotated_right = Hex(-1,-4,5);
        let rotated_left = Hex(-4,5,-1);

        it("should rotate right correctly", () => {
            expect(rotated_right).toEqual(hex_rotate_right(rotation_target));
        });
        it("should rotate left correctly", () => {
            expect(rotated_left).toEqual(hex_rotate_left(rotation_target));
        });
            
    });
});

describe("Hex Directions", () => {
    it("should return in predictable order, starting at index 0 = Hex(1, 0, -1) and rotating anti-clockwise to Hex(0, 1, -1)", () => {
        expect(Hex(0, -1, 1)).toEqual(hex_direction(2));
        expect(Hex(0, 1, -1)).toEqual(hex_direction(5));
    });
    it("should return index 0 = East for Horizontal orientation", () => {
        expect(Hex(0, -1, 1)).toEqual(hex_direction("NorthWest"));
        expect(Hex(0, 1, -1)).toEqual(hex_direction("SouthEast"));
    });
    it("should return index 0 = North for Vertical orientation", () => {
        expect(Hex(0, -1, 1)).toEqual(hex_direction("SouthWest", false));
        expect(Hex(0, 1, -1)).toEqual(hex_direction("NorthEast", false));
    });
});

describe("Hex Neighbors", () => {
    it("should have the expected neighbor", () => {
         expect(Hex(1, -3, 2)).toEqual(hex_neighbor(Hex(1, -2, 1), 2));
         expect(Hex(1, 1, 2)).toEqual(hex_neighbor(Hex(1, 2, 1), 2));
    })
});

describe("Hex Diagonal", () => {
    it("should Hex(1,-2, 1) see Hex (-1, -1 ,2) to its Wast", () => {
        expect(Hex(-1, -1, 2)).toEqual(hex_diagonal_neighbor(Hex(1, -2, 1), 3));
    });
});

describe("Hex distance should be equal to the half the sum of the absolute values of the Hex's vectors", () => {
    it("7, for Hex(3, -7, 4) from origin", () => {
        expect(7).toEqual(hex_distance(Hex(3, -7, 4), Hex(0, 0, 0)));
    });
    it("9, for Hex(-4, 9, -5) from origin", () => {
        expect(9).toEqual(hex_distance(Hex(-4, 9, -5), Hex(0, 0, 0)));
    });
});

describe("Hex rounding", () => {
    const a = Hex(0, 0, 0);
    const b = Hex(1, -1, 0);
    const c = Hex(0, -1, 1);

    it("example 1 should calculate as expected", () => {
        expect(Hex(5, -10, 5)).toEqual(hex_round(hex_lerp(Hex(0, 0, 0), Hex(10, -20, 10), 0.5)));
    });
    it("example 2 should calculate as expected", () => {
        expect(hex_round(a)).toEqual(hex_round(hex_lerp(a, b, 0.499)));
    });
    it("example 3 should calculate as expected", () => {
        expect(hex_round(b)).toEqual(hex_round(hex_lerp(a, b, 0.501)));
    });
    it("example 4 should calculate as expected", () => {
        expect(hex_round(a)).toEqual(hex_round(Hex(a.q * 0.4 + b.q * 0.3 + c.q * 0.3, a.r * 0.4 + b.r * 0.3 + c.r * 0.3, a.s * 0.4 + b.s * 0.3 + c.s * 0.3)));
    });
    it("example 5 should calculate as expected", () => {
        expect(hex_round(c)).toEqual(hex_round(Hex(a.q * 0.3 + b.q * 0.3 + c.q * 0.4, a.r * 0.3 + b.r * 0.3 + c.r * 0.4, a.s * 0.3 + b.s * 0.3 + c.s * 0.4)));
    });
});

describe("Hex Linedraw", () => {
    it("should provide the correct six points to draw the current hex point?", () => {
        //Failing because of order. Implement sort.
        expect([Hex(0, 0, 0), Hex(0, -1, 1), Hex(0, -2, 2), Hex(1, -3, 2), Hex(1, -4, 3), Hex(1, -5, 4)]).toEqual(hex_linedraw(Hex(0, 0, 0), Hex(1, -5, 4)));
    });
});

describe("Hex Layout", () => {
    it("should calculate as expected and have a better spec name", () => {
        var h = Hex(3, 4, -7);
        var flat = Layout(layout_flat, Point(10, 15), Point(35, 71));
        expect(h).toEqual(hex_round(pixel_to_hex(flat, hex_to_pixel(flat, h))));
        var pointy = Layout(layout_pointy, Point(10, 15), Point(35, 71));
        expect(h).toEqual(hex_round(pixel_to_hex(pointy, hex_to_pixel(pointy, h))));
    });
});

describe("Conversion Round Trip", () => {
        //Imports and It statements
        var a = Hex(3, 4, -7);
        var b = OffsetCoord(1, -3);
        
        it("conversion_roundtrip even-q", () => { 
            expect(a).toEqual(qoffset_to_cube(EVEN, qoffset_from_cube(EVEN, a)));
        });
        it("conversion_roundtrip even-q", () => { 
             expect(b).toEqual(qoffset_from_cube(EVEN, qoffset_to_cube(EVEN, b)));
        });
        it("conversion_roundtrip odd-q", () => {
            expect(a).toEqual(qoffset_to_cube(ODD, qoffset_from_cube(ODD, a)));
        });
        it("conversion_roundtrip odd-q", () => {
            expect(b).toEqual(qoffset_from_cube(ODD, qoffset_to_cube(ODD, b)));
        });
        it("conversion_roundtrip even-r", () => {
            expect(a).toEqual(roffset_to_cube(EVEN, roffset_from_cube(EVEN, a)));
        });
        it("conversion_roundtrip even-r", () => {
            expect(b).toEqual(roffset_from_cube(EVEN, roffset_to_cube(EVEN, b)));
        });
        it("conversion_roundtrip odd-r", () => {
            expect(a).toEqual(roffset_to_cube(ODD, roffset_from_cube(ODD, a)));
        });
        it("conversion_roundtrip odd-r", () => {
            expect(b).toEqual(roffset_from_cube(ODD, roffset_to_cube(ODD, b)));
        });
});

describe("Hex Offset Coords FROM Cube", () => {
    it("offset_from_cube even-q", () => {
        expect(OffsetCoord(1, 3)).toEqual(qoffset_from_cube(EVEN, Hex(1, 2, -3)));
    });
    it("offset_from_cube odd-q", () => {
        expect(OffsetCoord(1, 2)).toEqual(qoffset_from_cube(ODD, Hex(1, 2, -3)));
    });
});

describe("Hex Offset Coords TO Cube", () => {
    it("offset_to_cube even-", () =>{
        expect(Hex(1, 2, -3)).toEqual(qoffset_to_cube(EVEN, OffsetCoord(1, 3)));
    });
    it("offset_to_cube odd-q", () => {
        expect(Hex(1, 2, -3)).toEqual(qoffset_to_cube(ODD, OffsetCoord(1, 2)));
    }); 
});