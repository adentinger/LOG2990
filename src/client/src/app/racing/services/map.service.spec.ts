import { TestBed, inject } from '@angular/core/testing';

import { MapService } from './map.service';
import { Map } from '../../admin-screen/map-editor/map';
import { MAP0, MAP1, MAP2, NUMBER_OF_MOCK_MAPS } from './mock-maps';

let gottenMap: Map;
let gottenMapNames: string[];

function setMap(map: Map) {
    gottenMap = map;
}

function setMapNames(names: string[]) {
    gottenMapNames = names;
}


describe('MapService', () => {

    let mapService: MapService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MapService]
        });
        inject([MapService], (injectedService: MapService) => {
            mapService = injectedService;
        });
    });

    it('should be created', inject([MapService], (service: MapService) => {
        expect(service).toBeTruthy();
    }));

    describe('getByName', () => {

        it('should get map when it exists', () => {
            mapService.getByName('map0').then(setMap);
            expect(gottenMap).toEqual(MAP0);
        });

        it('should not get map when it does not exist', () => {
            expect(mapService.getByName('Chuck Norris')).toThrowError();
        });

    });

    describe('getMapNames ', () => {

        it('should succeed when requested zero names', () => {
            mapService.getMapNames(0).then(setMapNames);
            expect(gottenMapNames).toEqual([]);
        });

        it('should return the requested number of names if there are enough', () => {
            let len: number;
            mapService.getMapNames(2).then((value: string[]) => len = value.length);
            expect(len).toEqual(2);
        });

        it('should return the maximum amount of map names if there are not enough', () => {
            let len: number;
            mapService.getMapNames(25).then((value: string[]) => len = value.length);
            expect(len).toEqual(NUMBER_OF_MOCK_MAPS);
        });

        it('should throw an error when more than 100 map names are required.', () => {
            mapService.getMapNames(100);
            expect(mapService.getMapNames(101)).toThrowError();
        });

    });

    it('should allow creating a map', () => {
        mapService.postMap(MAP0);
        mapService.getByName(MAP0.name).then(setMap);
        expect(gottenMap).toEqual(MAP0);
    });

    it('should allow updating an existing map', () => {
        mapService.postMap(MAP0);
        const OLD_NAME = MAP1.name;
        MAP1.name = MAP0.name;
        mapService.putMap(MAP1);

        mapService.getByName(MAP0.name).then(setMap);
        expect(gottenMap).toEqual(MAP1);

        MAP1.name = OLD_NAME;
    });

});
