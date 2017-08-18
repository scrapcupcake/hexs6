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

    let mapRadius = 1;
    let centerHex = Hex(0,0,0);

    describe("Mirroring", () => {
        let wraparound_mirrors = wraparound_mirror_centers(mapRadius);
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
    });

    describe("A radius 1 map", () => {
            describe("should return undefined when you're way far off the map", () => {
                let farHex = Hex(0,-10,10);
                expect(wraparound_bounds(farHex,1)).toBe(undefined);
            })
            
            describe("should return you to the southwest when you walk off the northeast", () => {
                let northeast = Hex(1,-1,0);
                let southwest = Hex(-1,1,0);
                let northerEaster = Hex(2,-2,0);
                it("should pass a sanity check", () => {
                    expect(northerEaster).toEqual(hex_add(northeast,hex_direction("NorthEast")));
                });
                let wrapped = wraparound_bounds(northerEaster,1);
                it("should be west after wrapping around", () => {
                    expect(wrapped).toEqual(southwest);
                });

            });
            describe("should return you to the west when you walk off the east", () => {
                let west = Hex(-1,0,1);
                let east = Hex(1,0,-1);
                let eastEast = Hex(2,0,-2);
                it("should pass a sanity check", () => {
                    expect(eastEast).toEqual(hex_add(east,hex_direction("East")));
                });
                let wrapped = wraparound_bounds(eastEast,1);
                it("should be west after wrapping around", () => {
                    expect(wrapped).toEqual(west);
                });
            });
        });