//Example of how this library could be used

import { Hex, hex_directions, hex_direction } from './hexs6';
//import * as emoji from 'node-emoji';
import {
    create_hex_cells,
    get_hex,
    hex_array_to_map_reducer,
    hexmap_values,
    hexmap_neighbors,
    hexmap_wraparound_neighbors,
    wraparound_mirror_centers,
    store_hex
} from './hexmaps6';

export {hexmap_values} from './hexmaps6';

export class HexCellMap {
    [id:number] : HexCell;
    get = get_hex;
    set = store_hex;
}

export class HexCell {
     q:number; 
     r:number;
     s:number;
     emoji?:string;
}

export class HexWorld{
    radius?: number;
    cells?: HexCellMap;
}

export function hexWorldReducer(state:HexWorld={}, action={type:"",payload:{}}){
    switch(action.type){
        case "init":
        let world = Object.assign({radius: 4, cells: {}}, state);

        world.cells = create_hex_cells(world.radius)
                      .map((c) => hexCellReducer(c))
                      .reduce(hex_array_to_map_reducer, {});
        return world;
        case "advance": //TODO
            //let mirrorCenters = wraparound_mirror_centers(state.radius);
            let nextCells = hexmap_values(state.cells).map((c) => {
                let neighbors = hexmap_neighbors(c,state.cells);
                return hexCellReducer(c, {type:"advance", payload: neighbors});
            }).reduce(hex_array_to_map_reducer, {});
            
            let newState = Object.assign(state, {cells:nextCells}); //And before here.
            //console.log("Eh?", state.cells === newState.cells);
            return newState;
        default:
        return state;
    }
}

let aliveCheck = (emoji) => {
    switch(emoji){
        case ":sparkles:":
        case ":sparkle:":
            return true;
        case "":
        default:
            return false;
    }
}

export function hexCellReducer(state:HexCell={q:Infinity,r:Infinity,s:Infinity}, action={type:"init", payload:[]}){
    switch(action.type){
        case "init":
            let cell = Object.assign({emoji:(Math.random()>0.4)?":sparkles:":""}, state);
            return cell;
        case "advance":
            let neighbors = action.payload;
            if(neighbors.length < 6){
                 return Object.assign(state,{emoji:""}); //Edges die
            }
            //console.log(`${state.q},${state.r},${state.s} with`, neighbors);
            let aliveNeighbors = neighbors.reduce((acc,cur) => { return acc + ( aliveCheck(cur.emoji)?0:1);},0);
            if(aliveCheck(state.emoji)){
                switch(aliveNeighbors){
                    case 1:
                    case 2:                
                        return Object.assign(state,{emoji:":sparkles:"}); //Enough people to just hang out, be cool
                    default:
                        return Object.assign(state,{emoji:""}); //Dead
                }
            }else{
                switch(6-aliveNeighbors){ //Dead neighbors
                    case 2:
                        return Object.assign(state,{emoji:":sparkle:"}); //Just the right number of blanks and a new ship forms
                    default:
                        return Object.assign(state,{emoji:""}); //Still dead
                }
            }

        default:
        return state;
    }
}