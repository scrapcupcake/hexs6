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
});