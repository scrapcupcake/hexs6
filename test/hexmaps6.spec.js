import {
    Hex,
    hex_add,
    hex_direction,
    hex_directions,
    hex_distance,
    hex_rotate_left,
    hex_rotate_right,
    HexAxis
} from '../src/hexs6';
import {
    create_hex_cells, hexmap_wraparound_neighbors,
    wraparound_mirror_centers, wraparound_bounds,
    map_size
} from '../src/hexmaps6';


describe("Hexmap", () => {

    describe("should generate the correct number of tiles for", () => {
        it("a radius of 0", () => { expect(create_hex_cells(0).length).toEqual(1) });
        it("a radius of 1", () => { 
            expect(create_hex_cells(1).length).toEqual(7);
        });
        it("a string radius of '1'", () => { 
            expect(create_hex_cells("1").length).toEqual(7);
        });
        it("a radius of 2", () => { expect(create_hex_cells(2).length).toEqual(19) });
    });

    describe("should have a consistent size between map_size and create_hex_cells", () => {
        [2,4,10,50].forEach((radius) => {
            let expected_map_size = map_size(radius);
            it(`for radius ${radius} should be size ${expected_map_size}`, () => {
                expect(create_hex_cells(radius).length).toEqual(expected_map_size);
            })
        })
    });

    let mapRadius = 4;
    let centerHex = Hex(0, 0, 0);
    let firstMirrorCenter = Hex(2 * mapRadius + 1, -mapRadius, -mapRadius - 1);
    let secondMirrorCenter = hex_rotate_right(firstMirrorCenter);
    let thirdMirrorCenter = hex_rotate_right(secondMirrorCenter);
    let fourthMirrorCenter = hex_rotate_right(thirdMirrorCenter);
    let fifthMirrorCenter = hex_rotate_right(fourthMirrorCenter);
    let sixthMirrorCenter = hex_rotate_left(firstMirrorCenter);
    let expectedMirrorList =
        [centerHex,
            firstMirrorCenter, secondMirrorCenter, thirdMirrorCenter,
            fourthMirrorCenter, fifthMirrorCenter, sixthMirrorCenter];

    describe("Mirroring", () => {
        let wraparound_mirrors = wraparound_mirror_centers(mapRadius);
        it("should provide the correct list of mirrors", () => {
            expect(wraparound_mirrors).toEqual(expectedMirrorList);
        });
        describe("should have opposite mirrors that add up to the center point", () => {
            it("for the first and fourth mirror center", () => {
                expect(hex_add(wraparound_mirrors[1], wraparound_mirrors[4])).toEqual(centerHex);
            });
            it("for the second and fifth mirror center", () => {
                expect(hex_add(wraparound_mirrors[2], wraparound_mirrors[5])).toEqual(centerHex);
            });
            it("for the third and sixth mirror center", () => {
                expect(hex_add(wraparound_mirrors[3], wraparound_mirrors[6])).toEqual(centerHex);
            });
        });

        //TODO: FIX THIS TEST
        describe("for a radius 1 map", () => {
            it("should return you to the bottom left when you walk off the top right", () => {
                let topHex = Hex(0,-1,1);
                let bottomHex = Hex(0,1,-1);
                let rotTestHex = hex_rotate_left(hex_rotate_left(hex_rotate_left(topHex)));
                expect(bottomHex).toEqual(rotTestHex);

                let topTopHex = hex_add(topHex,hex_direction("NorthEast"));
                let walkedTopHex = hex_add(hex_add(topHex,hex_direction("SouthWest")),hex_direction("SouthWest"));

                expect(walkedTopHex).toEqual(bottomHex);
                
                let wrapped = wraparound_bounds(topTopHex,1, wraparound_mirror_centers(1));
                
                expect(wrapped).toEqual(bottomHex);

            });
            it("should return you to the left when you walk off the right", () => {

            });
        });
    });
});