import {Hex} from './index';

/**
 * Simple named generator for an {x,y}
 * Useful for making code more self-documenting
 * @param x 
 * @param y 
 */
export function Point(x, y) {
    return { x, y };
}

export function Orientation(f0, f1, f2, f3, b0, b1, b2, b3, start_angle) {
    return { f0: f0, f1: f1, f2: f2, f3: f3, b0: b0, b1: b1, b2: b2, b3: b3, start_angle: start_angle };
}

/**
 * TODO: Docs
 * @param orientation 
 * @param size 
 * @param origin 
 */
export function Layout(orientation, size, origin) {
    return { orientation: orientation, size: size, origin: origin };
}

export const layout_pointy = Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);
export const layout_flat = Orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0);
export function hex_to_pixel(layout, h) {
    let M = layout.orientation;
    let size = layout.size;
    let origin = layout.origin;
    let x = (M.f0 * h.q + M.f1 * h.r) * size.x;
    let y = (M.f2 * h.q + M.f3 * h.r) * size.y;
    return Point(x + origin.x, y + origin.y);
}

export function pixel_to_hex(layout, p) {
    let M = layout.orientation;
    let size = layout.size;
    let origin = layout.origin;
    let pt = Point((p.x - origin.x) / size.x, (p.y - origin.y) / size.y);
    let q = M.b0 * pt.x + M.b1 * pt.y;
    let r = M.b2 * pt.x + M.b3 * pt.y;
    return Hex(q, r, -q - r);
}

export function hex_corner_offset(layout, corner) {
    let M = layout.orientation;
    let size = layout.size;
    let angle = 2.0 * Math.PI * (M.start_angle - corner) / 6;
    return Point(size.x * Math.cos(angle), size.y * Math.sin(angle));
}

export function polygon_corners(layout, h) {
    let corners = [];
    let center = hex_to_pixel(layout, h);
    for (let i = 0; i < 6; i++) {
        let offset = hex_corner_offset(layout, i);
        corners.push(Point(center.x + offset.x, center.y + offset.y));
    }
    return corners;
}