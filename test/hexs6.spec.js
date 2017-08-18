import {
    Hex,
    hex_add,
    hex_scale,
    hex_direction,
    hex_distance,
    hex_lerp,
    hex_linedraw,
    hex_neighbor,
    hex_diagonal_neighbor,
    hex_round,
    hex_subtract,
    hex_rotate_left,
    hex_rotate_right,
    hex_directions,
    hex_stringify,
    hex_direction_names_horizontal,
    hex_direction_names_vertical
} from '../src/index';

/**
 * Hexs6 Tests
 * 
 */

describe("Hex Arithmetic", () => {
    it("should equate its own position", () => {
        expect(Hex(0,0,0)).toEqual(Hex(0,0,0));
    });
    it("should be found in a list", () => {
        expect([Hex(0,0,0)]).toEqual([Hex(0,0,0)]);
    });
    it("should hex add", () => {
        expect(Hex(4, -10, 6)).toEqual(hex_add(Hex(1, -3, 2), Hex(3, -7, 4)));
    });

    it("should hex subtract", () => {
        expect(Hex(-2, 4, -2)).toEqual(hex_subtract(Hex(1, -3, 2), Hex(3, -7, 4)));
    });

    it("should hex scale", () => {
        expect(hex_scale(Hex(1,-1,0), 3)).toEqual(Hex(3,-3,0));
    })
});

describe("Hex Rotation", () => { 
    let center = Hex(0,0,0);

    describe("back and forth results in the same location", ()=>{
        it("at 2,-3, 1", ()=>{
            let rot = Hex(2,1,-3);
            expect(rot).toEqual(hex_rotate_right(hex_rotate_left(rot)));
        });
        it("at -4, 5, -1", ()=>{
            let rot = Hex(-4,5,-1);
            expect(rot).toEqual(hex_rotate_right(hex_rotate_left(rot)));
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
                expect(hex_rotate_right(next_hex)).toEqual(current_hex);
            });

            it(`${hex_stringify(prev_hex)} should rotate left into \n${hex_stringify(current_hex)}\n vs \n${hex_stringify(hex_rotate_left(prev_hex))}`, ()=> {
                expect(hex_rotate_left(prev_hex)).toEqual(current_hex);
            });


            let horizontal_name = hex_direction_names_horizontal[i];
            it(`should match the horizontal alignment ${horizontal_name}`, () => {
                expect(hex_direction(horizontal_name)).toEqual(current_hex);
            });

            let vertical_name = hex_direction_names_vertical[i];
            it(`should match the vertical alignment ${vertical_name}`, () => {
                expect(hex_direction(vertical_name, false)).toEqual(current_hex);
            });
            
        });
    }
});

describe("Hex Diagonal", () => {
    it("should Hex(0,-1,1) should have a diagonal northwest neighbor Hex(-1,-2,3)", () => {
        expect(Hex(-1, -2, 3)).toEqual(hex_diagonal_neighbor(Hex(0, -1, 1), 2));
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