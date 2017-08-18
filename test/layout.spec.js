import {Hex, Layout, Point, hex_round, pixel_to_hex, hex_to_pixel, layout_flat, layout_pointy} from '../src/index';

describe("Hex Layout", () => {
    it("should calculate as expected and have a better spec name", () => {
        var h = Hex(3, 4, -7);
        var flat = Layout(layout_flat, Point(10, 15), Point(35, 71));
        expect(h).toEqual(hex_round(pixel_to_hex(flat, hex_to_pixel(flat, h))));
        var pointy = Layout(layout_pointy, Point(10, 15), Point(35, 71));
        expect(h).toEqual(hex_round(pixel_to_hex(pointy, hex_to_pixel(pointy, h))));
    });
});