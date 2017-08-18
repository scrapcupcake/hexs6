import { Hex, hex_neighbors, hex_add, hex_rotate_right, hex_subtract, hex_distance, hex_stringify } from './hexs6';

export function HexStore(array_of_hexes=[]){
    return array_of_hexes.reduce(hex_array_to_map_reducer,{});
}

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

export function add_hex_pos_to(array_of_objects, radius){
    let pos = create_hex_cells(radius);
    if(pos.length != array_of_objects.length){
        console.warn(
            "Adding positions to array of unequal length; is your data correct?",
             pos, array_of_objects);
    }
    return Array.from(array_of_objects).map((target,ordinal) => {
        //TODO: possibly do conversion of non-objects into objects with a {value: target}?
        return {...target, ...pos[ordinal]};
    });
}

export function hexmap_wraparound_neighbors(hex,map, mirrors){
        return hex_neighbors(hex).map((neighborPos) => {
                    let realPos = wraparound_bounds(neighborPos, map.radius, mirrors);
                    if(realPos != neighborPos){ console.log("We shifted off the board?", neighborPos, realPos); }
                    return get_hex(realPos,map);
                }).filter((n) => {return !!n});
}