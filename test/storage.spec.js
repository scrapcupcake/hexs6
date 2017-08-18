import {Hex,
    HexStore,hex_hash,
    hexmap_values,
    store_hex,get_hex,
    hex_direction,hex_scale} from '../src/index';

//Used extensively throughout as prototype hexes
let ORIGIN = Hex(0,0,0);
let NORTHEAST = hex_direction("NORTHEAST");
let SOUTHWEST = hex_direction("SOUTHWEST");

describe("HexStore, a hash-map for Hex(q,r,s) positioned objects", () => {
    describe("hashing", () => {
        describe("should be able to hash consistently", () => {

            it("Hex(0,0,0) = Hex(0,0,0)", () => {
                expect(hex_hash(ORIGIN)).toEqual(hex_hash(ORIGIN));
            });
            it("Hex(1,-1,0) != Hex(-1,1,0)", () => {
                expect(hex_hash(NORTHEAST)).not.toEqual(hex_hash(SOUTHWEST));
            });
            it("Hex(50,-50,0) = Hex(50,-50,0)", () => {
                let fiftyNortheast = hex_scale(NORTHEAST,50);
                expect(hex_hash(fiftyNortheast)).toEqual(hex_hash(fiftyNortheast));
            });
        });
    });
    describe("storage and retrieval", () => {
        describe("should return a correctly hash accessible storage object", () => {
            let storableHexes = [ORIGIN,NORTHEAST,SOUTHWEST];
            let storedHexes = HexStore(storableHexes);
            it("stored", () => {
                expect(hexmap_values(storedHexes)).toEqual(storableHexes);
            });
            it("can retrieve one", () => {
                expect(get_hex(ORIGIN,storedHexes)).toEqual(ORIGIN);
            });
            it("can store one", () => {
                let theseHexes = {...storedHexes};
                let farHex = Hex(0,50,-50);
                store_hex(farHex,theseHexes);
                expect(hexmap_values(theseHexes)).toEqual([...storableHexes,farHex])
            });
            describe("can store and retrieve with extra properties, without harm", () => {
                let lifeHexes = storableHexes.map((hex) => ({...hex, alive:true}));
                let farDeadHex = {...Hex(0,50,-50), alive:false};
                let lifeStore = HexStore([...lifeHexes,farDeadHex]);
                it("has dead", () => {expect(get_hex(farDeadHex,lifeStore).alive).toBe(false);});
                it("has alive", () => {expect(get_hex(NORTHEAST,lifeStore).alive).toBe(true);});
            });
        });
    });
});