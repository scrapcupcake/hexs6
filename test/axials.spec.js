import {Hex, hex_add, hex_direction, HexAxis, axial_to_cube, cube_to_axial} from '../src/index.js';

describe("Hex Axis Coordinates", () => {
    it("can convert from axial to cube and back", () => {
        let hexHex = Hex(0,0,0);
        let northWestHex = hex_add(hexHex, hex_direction("NorthWest"));
        let testAxial = cube_to_axial(northWestHex);
        expect(testAxial).toEqual({q:0,s:1});
        expect(axial_to_cube(testAxial)).toEqual(northWestHex);
    })
});