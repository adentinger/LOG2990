import { TestBed, inject } from '@angular/core/testing';

import { MapService } from './map.service';
import { Map } from '../../admin-screen/map-editor/map';
import { MAP0, MAP1, MAP2, MAPS } from './mock-maps';

let gottenMap: Map;
let gottenMapIds: number[];

function setMap(map: Map) {
    gottenMap = map;
}

function setMapIds(names: number[]) {
    gottenMapIds = names;
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

    describe('getById', () => {

        it('should get map when it exists', () => {
            mapService.getById(0).then(setMap);
            expect(gottenMap).toEqual(MAP0);
        });

        it('should throw an error when map does not exist', () => {
            expect(mapService.getById(123456)).toThrowError();
        });

    });

    describe('getMapIds', () => {

        it('should succeed when requested zero names', () => {
            mapService.getMapIds(0).then(setMapIds);
            expect(gottenMapIds.length).toEqual(0);
        });

        it('should return the requested number of names if there are enough', () => {
            mapService.getMapIds(2).then(setMapIds);
            expect(gottenMapIds.length).toEqual(2);
        });

        it('should return the maximum amount of map names if there are not enough', () => {
            mapService.getMapIds(25).then(setMapIds);
            expect(gottenMapIds.length).toEqual(MAPS.length);
        });

        it('should throw an error when more than 100 map names are required.', () => {
            mapService.getMapIds(100);
            expect(mapService.getMapIds(101)).toThrowError();
        });

    });

    it('should allow creating a map', () => {
        mapService.postMap(MAP0);
        mapService.getById(0).then(setMap);
        expect(gottenMap).toEqual(MAP0);
    });

    it('should allow updating an existing map', () => {
        mapService.postMap(MAP0);
        const OLD_NAME = MAP1.name;
        MAP1.name = MAP0.name;
        mapService.putMap(MAP1);

        mapService.getById(0).then(setMap);
        expect(gottenMap).toEqual(MAP1);

        MAP1.name = OLD_NAME;
    });

});
