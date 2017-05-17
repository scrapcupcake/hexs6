import { Hex, hex_add, hex_rotate_left, HexAxis, hex_rotate_right } from './hexs6';
import { create_hex_cells, wraparound_mirror_centers } from "./hexmaps6";

describe("Hexmap", () => {

    describe("should generate the correct number of tiles for", () => {
        it("a radius of 0",() => { expect(create_hex_cells(0).length).toEqual(1) });
        it("a radius of 1",() => { expect(create_hex_cells(1).length).toEqual(7) });
        it("a radius of 2",() => { expect(create_hex_cells(2).length).toEqual(19) });
    })

    let mapRadius = 4;
    let centerHex = Hex(0,0,0);
    let firstMirrorCenter = Hex(2*mapRadius+1, -mapRadius, -mapRadius-1);
    let secondMirrorCenter = hex_rotate_right(firstMirrorCenter);
    let thirdMirrorCenter = hex_rotate_right(secondMirrorCenter);
    let fourthMirrorCenter = hex_rotate_right(thirdMirrorCenter);
    let fifthMirrorCenter = hex_rotate_right(fourthMirrorCenter);
    let sixthMirrorCenter = hex_rotate_left(firstMirrorCenter);

    describe("should rotate correctly", () => {
        it("should be the same rotating either way", () => {
            expect(sixthMirrorCenter).toEqual(hex_rotate_right(fifthMirrorCenter));
        })
    })

    

    describe("Mirroring", () => {
        it("should provide the correct list of mirrors", () => {
            expect(wraparound_mirror_centers(mapRadius)).toEqual([
                centerHex,firstMirrorCenter,secondMirrorCenter,thirdMirrorCenter,fourthMirrorCenter,fifthMirrorCenter,sixthMirrorCenter
                ]);
        });
    });
});