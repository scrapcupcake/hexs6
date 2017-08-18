import { Hex, hex_neighbors, hex_add, hex_rotate_right, hex_subtract, hex_distance, hex_stringify } from './hexs6';

export function map_size(radius){
    radius = parseInt(radius);
    return radius == 0 ? 1 : 6*radius + map_size(radius-1);
}

export function* traverse_hex_cells(radius){
    radius = parseInt(radius);
    for(let q = -radius; q <= radius; q++){
        let start = Math.max(-radius, -q - radius);
        let end = Math.min(radius, -q + radius);

        for(let r = start; r <= end; r++){
            let hex = Hex(q,r,-q-r);
            yield hex;
        }
    }
}

export function create_hex_cells(radius){
        let map = new Array();
        for(let pos of traverse_hex_cells(radius))
        {
            map.push(pos);
        }
        return map;
}

export function wraparound_mirror_centers(radius,origin=Hex(0,0,0)){
    let offsets = [origin, hex_add(origin,Hex(2*radius+1, -(radius-1), -(2*radius+1) )) ];
    while(offsets.length < 7){
        let prev = offsets[offsets.length-1];
        offsets.push(hex_rotate_right(prev));
    }
    return offsets;
}

//Oh, right! Fixed! Please use!
export function wraparound_bounds(position,radius,centers=wraparound_mirror_centers(radius)){
    for(let offset of centers){
        let distance = hex_distance(position, offset);0
        if(radius >= distance){
            return hex_subtract(position,  offset);
        }
    }
    console.error("\nUnable to find any center we're less than a radius away from?!\nPlease check your passed in centers.",position,radius,centers);
    return undefined;
}