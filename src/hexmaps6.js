import { Hex, hex_neighbors, hex_add, hex_rotate_right, hex_subtract, hex_distance, hex_stringify } from './hexs6';

export function string_hash_code(string){
	var hash = 0;
	if (string.length == 0) return hash;
	for (let i = 0; i < string.length; i++) {
		let char = string.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

export function hex_hash(hex){
    return string_hash_code(hex_stringify(hex));
}

export function store_hex(hex,map){
    map[hex_hash(hex)] = hex;
}

export function get_hex(hex,map){
    return map[hex_hash(hex)];
}

export function hexmap_values(hexmap){
    return Object.keys(hexmap).map((k) =>{return hexmap[k];})
}

export function hexmap_neighbors(hex,map){
        return hex_neighbors(hex).map((neighborPos) => {
                    return get_hex(neighborPos,map);
                }).filter((n) => {return !!n});
}

export function hex_array_to_map_reducer(map, currentArrayItem){
    store_hex(currentArrayItem, map); 
    return map;
}

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
    let offsets = [origin, hex_add(origin,Hex(2*radius+1, -radius, -radius-1)) ];
    while(offsets.length < 7){
        let prev = offsets[offsets.length-1];
        offsets.push(hex_rotate_right(prev));
    }
    return offsets;
}

//Oh, right! Fixed! Please use!
export function wraparound_bounds(position,radius,centers=wraparound_mirror_centers(radius)){
    for(let offset of centers){
        let distance = hex_distance(position, offset);
        let check = distance <= radius;
        if(check){
            return hex_subtract(position,  offset);
        }
    }
    console.error("\nUnable to find any center we're less than a radius away from?!\nPlease check your passed in centers.");
    return undefined;
}

export function hexmap_wraparound_neighbors(hex,map, mirrors){
        return hex_neighbors(hex).map((neighborPos) => {
                    let realPos = wraparound_bounds(neighborPos, map.radius, mirrors);
                    if(realPos != neighborPos){ console.log("We shifted off the board?", neighborPos, realPos); }
                    return get_hex(realPos,map);
                }).filter((n) => {return !!n});
}