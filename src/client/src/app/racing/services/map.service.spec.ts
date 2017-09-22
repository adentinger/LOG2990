import { TestBed, inject } from '@angular/core/testing';

import { MapService } from './map.service';
import { Map } from '../../admin-screen/map-editor/map';
import { MAP0, MAP1, MAP2, MAPS, NEW_MAP3 } from './mock-maps';

let gottenMap: Map;
let gottenMapIds: number[];
let gottenId: number;

function setMap(map: Map) {
    gottenMap = map;
}

function setMapIds(names: number[]) {
    gottenMapIds = names;
}

function setId(id: number) {
    gottenId = id;
}


describe('MapService', () => {

    let mapService: MapService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MapService]
        });
    });

    beforeEach(inject([MapService], (injectedService: MapService) => {
        mapService = injectedService;
    }));

    it('should be created', inject([MapService], (service: MapService) => {
        expect(service).toBeTruthy();
    }));

    describe('getById', () => {

        it('should get map when it exists', () => {
            mapService.getById(0).then(setMap);
            expect(gottenMap).toEqual(MAP0);
        });

        it('should reject promise when map does not exist', () => {
            mapService.getById(123456).then(fail).catch();
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

        it('should reject promise when more than 100 map names are required.', () => {
            mapService.getMapIds(100);
            mapService.getMapIds(101).then(fail).catch();
        });

    });

    it('should allow creating a map', () => {
        mapService.postMap(NEW_MAP3).then(setId);
        expect(gottenId).toBeGreaterThanOrEqual(MAPS.length);
        mapService.getById(gottenId).then(setMap);
        expect(gottenMap).toEqual(NEW_MAP3);
    });

    it('should allow updating an existing map', () => {
        mapService.putMap(NEW_MAP3, 0);
        mapService.getById(0).then(setMap);
        expect(gottenMap).toEqual(NEW_MAP3);
    });

});
