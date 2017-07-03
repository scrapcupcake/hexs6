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
    roffset_to_cube,
    hex_directions,
    hex_stringify,
    hex_direction_names_horizontal,
    hex_direction_names_vertical
} from '../src/hexs6';

import { expect } from 'chai';

/**
 * Hexs6 Tests
 * 
 */

describe("Hex Arithmetic", () => {
    it("should hex add", () => {
        expect(Hex(4, -10, 6)).to.deep.equal(hex_add(Hex(1, -3, 2), Hex(3, -7, 4)));
    });

    it("it should hex subtract", () => {
        expect(Hex(-2, 4, -2)).to.deep.equal(hex_subtract(Hex(1, -3, 2), Hex(3, -7, 4)));
    });
});

describe("Hex Rotation", () => { 
    let center = Hex(0,0,0);

    describe("back and forth results in the same location", ()=>{
        it("at 2,-3, 1", ()=>{
            let rot = Hex(2,1,-3);
            expect(rot).to.deep.equal(hex_rotate_right(hex_rotate_left(rot)));
        });
        it("at -4, 5, -1", ()=>{
            let rot = Hex(-4,5,-1);
            expect(rot).to.deep.equal(hex_rotate_right(hex_rotate_left(rot)));
        });    
    });
});

function next_direction(index){
    return index==5 ? 0 : index+1;
}

function prev_direction(index){
    return index==0 ? 5 : index-1;
}

describe("Hex Directions", () => {
    for(let i=0; i<6; i++){
        let prev_hex = hex_directions[prev_direction(i)];
        let current_hex = hex_directions[i];
        let next_hex = hex_directions[next_direction(i)];
        //console.log(`\nLeft: ${hex_stringify(next_hex)}\nCurrent: ${hex_stringify(current_hex)} \nRight: ${hex_stringify(prev_hex)}\n`)
        describe(`at index ${i}, in direction ${hex_direction_names_horizontal[i]}`, () => {
            it(` ${hex_stringify(next_hex)} should rotate right into ${hex_stringify(current_hex)} vs \n${hex_stringify(hex_rotate_right(next_hex))}`, ()=> {
                expect(hex_rotate_right(next_hex)).to.deep.equal(current_hex);
            });

            it(`${hex_stringify(prev_hex)} should rotate left into \n${hex_stringify(current_hex)}\n vs \n${hex_stringify(hex_rotate_left(prev_hex))}`, ()=> {
                expect(hex_rotate_left(prev_hex)).to.deep.equal(current_hex);
            });


            let horizontal_name = hex_direction_names_horizontal[i];
            it(`should match the horizontal alignment ${horizontal_name}`, () => {
                expect(hex_direction(horizontal_name)).to.deep.equal(current_hex);
            });

            let vertical_name = hex_direction_names_vertical[i];
            it(`should match the vertical alignment ${vertical_name}`, () => {
                expect(hex_direction(vertical_name, false)).to.deep.equal(current_hex);
            });
            
        });
    }
});

describe("Hex Neighbors", () => {
    it("should have the expected neighbor for origin", () => {
         expect(Hex(1, 0, -1)).to.deep.equal(hex_neighbor(Hex(0,0,0),0));
    });
    it("should have the expected neighbor for Hex(1,-2,1) toward the northwest, Hex(1,-3,2)", () => {
         expect(Hex(0,-2,2)).to.deep.equal(hex_neighbor(Hex(1,-3,2), "NorthWest"));
    });


});

describe("Hex Diagonal", () => {
    it("should Hex(1,-2, 1) see Hex (-1, -1 ,2) to its Wast", () => {
        expect(Hex(-1, -1, 2)).to.deep.equal(hex_diagonal_neighbor(Hex(1, -2, 1), 3));
    });
});

describe("Hex distance should be equal to the half the sum of the absolute values of the Hex's vectors", () => {
    it("7, for Hex(3, -7, 4) from origin", () => {
        expect(7).to.deep.equal(hex_distance(Hex(3, -7, 4), Hex(0, 0, 0)));
    });
    it("9, for Hex(-4, 9, -5) from origin", () => {
        expect(9).to.deep.equal(hex_distance(Hex(-4, 9, -5), Hex(0, 0, 0)));
    });
});

describe("Hex rounding", () => {
    const a = Hex(0, 0, 0);
    const b = Hex(1, -1, 0);
    const c = Hex(0, -1, 1);

    it("example 1 should calculate as expected", () => {
        expect(Hex(5, -10, 5)).to.deep.equal(hex_round(hex_lerp(Hex(0, 0, 0), Hex(10, -20, 10), 0.5)));
    });
    it("example 2 should calculate as expected", () => {
        expect(hex_round(a)).to.deep.equal(hex_round(hex_lerp(a, b, 0.499)));
    });
    it("example 3 should calculate as expected", () => {
        expect(hex_round(b)).to.deep.equal(hex_round(hex_lerp(a, b, 0.501)));
    });
    it("example 4 should calculate as expected", () => {
        expect(hex_round(a)).to.deep.equal(hex_round(Hex(a.q * 0.4 + b.q * 0.3 + c.q * 0.3, a.r * 0.4 + b.r * 0.3 + c.r * 0.3, a.s * 0.4 + b.s * 0.3 + c.s * 0.3)));
    });
    it("example 5 should calculate as expected", () => {
        expect(hex_round(c)).to.deep.equal(hex_round(Hex(a.q * 0.3 + b.q * 0.3 + c.q * 0.4, a.r * 0.3 + b.r * 0.3 + c.r * 0.4, a.s * 0.3 + b.s * 0.3 + c.s * 0.4)));
    });
});

describe("Hex Linedraw", () => {
    it("should provide the correct six points to draw the current hex point?", () => {
        //Failing because of order. Implement sort.
        expect([Hex(0, 0, 0), Hex(0, -1, 1), Hex(0, -2, 2), Hex(1, -3, 2), Hex(1, -4, 3), Hex(1, -5, 4)]).to.deep.equal(hex_linedraw(Hex(0, 0, 0), Hex(1, -5, 4)));
    });
});

describe("Hex Layout", () => {
    it("should calculate as expected and have a better spec name", () => {
        var h = Hex(3, 4, -7);
        var flat = Layout(layout_flat, Point(10, 15), Point(35, 71));
        expect(h).to.deep.equal(hex_round(pixel_to_hex(flat, hex_to_pixel(flat, h))));
        var pointy = Layout(layout_pointy, Point(10, 15), Point(35, 71));
        expect(h).to.deep.equal(hex_round(pixel_to_hex(pointy, hex_to_pixel(pointy, h))));
    });
});

describe("Conversion Round Trip", () => {
        //Imports and It statements
        var a = Hex(3, 4, -7);
        var b = OffsetCoord(1, -3);
        
        it("conversion_roundtrip even-q", () => { 
            expect(a).to.deep.equal(qoffset_to_cube(EVEN, qoffset_from_cube(EVEN, a)));
        });
        it("conversion_roundtrip even-q", () => { 
             expect(b).to.deep.equal(qoffset_from_cube(EVEN, qoffset_to_cube(EVEN, b)));
        });
        it("conversion_roundtrip odd-q", () => {
            expect(a).to.deep.equal(qoffset_to_cube(ODD, qoffset_from_cube(ODD, a)));
        });
        it("conversion_roundtrip odd-q", () => {
            expect(b).to.deep.equal(qoffset_from_cube(ODD, qoffset_to_cube(ODD, b)));
        });
        it("conversion_roundtrip even-r", () => {
            expect(a).to.deep.equal(roffset_to_cube(EVEN, roffset_from_cube(EVEN, a)));
        });
        it("conversion_roundtrip even-r", () => {
            expect(b).to.deep.equal(roffset_from_cube(EVEN, roffset_to_cube(EVEN, b)));
        });
        it("conversion_roundtrip odd-r", () => {
            expect(a).to.deep.equal(roffset_to_cube(ODD, roffset_from_cube(ODD, a)));
        });
        it("conversion_roundtrip odd-r", () => {
            expect(b).to.deep.equal(roffset_from_cube(ODD, roffset_to_cube(ODD, b)));
        });
});

describe("Hex Offset Coords FROM Cube", () => {
    it("offset_from_cube even-q", () => {
        expect(OffsetCoord(1, 3)).to.deep.equal(qoffset_from_cube(EVEN, Hex(1, 2, -3)));
    });
    it("offset_from_cube odd-q", () => {
        expect(OffsetCoord(1, 2)).to.deep.equal(qoffset_from_cube(ODD, Hex(1, 2, -3)));
    });
});

describe("Hex Offset Coords TO Cube", () => {
    it("offset_to_cube even-", () =>{
        expect(Hex(1, 2, -3)).to.deep.equal(qoffset_to_cube(EVEN, OffsetCoord(1, 3)));
    });
    it("offset_to_cube odd-q", () => {
        expect(Hex(1, 2, -3)).to.deep.equal(qoffset_to_cube(ODD, OffsetCoord(1, 2)));
    }); 
});