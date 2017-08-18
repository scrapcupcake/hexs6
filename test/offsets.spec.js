import {Hex, OffsetCoord, ODD, EVEN,
    qoffset_to_cube, qoffset_from_cube,
    roffset_from_cube, roffset_to_cube} from '../src/index';

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
        expect(OffsetCoord(1, 3)).toEqual(qoffset_from_cube(EVEN, Hex(1, 2, -3) ));
    });
    it("offset_from_cube odd-q", () => {
        expect(OffsetCoord(1, 2)).toEqual(qoffset_from_cube(ODD, Hex(1, 2, -3) ));
    });
});

describe("Hex Offset Coords TO Cube", () => {
    let cube = Hex(1, 2, -3);
    it("offset_to_cube even-", () =>{
        expect( cube ).toEqual(qoffset_to_cube(EVEN, OffsetCoord(1, 3)));
    });
    it("offset_to_cube odd-q", () => {
        expect( cube ).toEqual(qoffset_to_cube(ODD, OffsetCoord(1, 2)));
    }); 
});