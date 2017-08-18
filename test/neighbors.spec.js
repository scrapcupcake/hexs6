import {
    Hex,
    hex_neighbor,
    hex_neighbors,
    hex_direction,
    hex_directions,
    hexmap_neighbors,
    HexStore,
    create_hex_cells
} from '../src/index';

const ORIGIN = Hex(0,0,0);
const NORTHWEST = hex_direction("northwest");

describe("Hex Neighbors", () => {
    it("should have the expected neighbor for origin", () => {
         expect(Hex(1, 0, -1)).toEqual(hex_neighbor(Hex(0,0,0),0));
    });
    it("should have the expected horizontal neighbor for Hex(1,-1,0) toward the northwest, Hex(1,-2,1)", () => {
         expect(Hex(1,-2,1)).toEqual(hex_neighbor(Hex(1,-1,0), "NorthWest"));
    });
    it("should have the expected vertical neighbor for Hex(1,-1,0) toward the northwest, Hex(1,-2,1)", () => {
         expect(Hex(2,-2,0)).toEqual(hex_neighbor(Hex(1,-1,0), "North", false));
    });
    describe("should have the expected neighbors", () => {
        let neighbors = hex_neighbors(Hex(0,0,0));
        expect(neighbors).toEqual(hex_directions);
    });

});

const countAlive = (acc,hex) => {return acc + hex.alive ? 1 : 0; }

const complexAlive = (hex) => {
    if(Math.abs(hex.q) + Math.abs(hex.r) + Math.abs(hex.s) == 2){
        return false;
    }else{
        return true;
    }
}

describe("HexMap neighbors", () => {
    //creates a ring of an alive hex in center, dead hexes around, alive on the edge
    let complexMap = HexStore(create_hex_cells(3).map((hex) => ({...hex,alive:complexAlive(hex)}) ));
    it("should have all dead neighbors at origin", () => {
        let aliveCount = hexmap_neighbors(ORIGIN,complexMap).reduce(countAlive,0);
        expect(aliveCount).toEqual(0);
    });
    it("should have four alive neighbors northwest of origin", () => {
        let aliveCount = hexmap_neighbors(NORTHWEST,complexMap).reduce(countAlive,0);
        //console.debug("Wat?!", complexMap);
        expect(aliveCount).toEqual(4);
    });
});
