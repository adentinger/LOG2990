import { TestBed, inject } from '@angular/core/testing';

import { MapEditorService } from './map-editor.service';
import { Map } from './map';
import { SerializedMap } from '../../common/racing/serialized-map';
import { MockMaps } from './mock-maps';
import { MockSerializedMaps } from '../../common/racing/mock-serialized-maps';
import { MapConverterService } from './map-converter.service';
import { RacingUnitConversionService } from './racing-unit-conversion.service';
import { Point } from '../../common/math/point';
import { Item } from './item';
import { SerializedItem } from '../../common/racing/serialized-item';

describe('MapEditorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MapEditorService,
                MapConverterService,
                RacingUnitConversionService,
                MockMaps,
                MockSerializedMaps
            ]
        });
    });

    let service: MapEditorService;
    let converter: RacingUnitConversionService;
    let mockMaps: MockMaps;
    let mockSerializedMaps: MockSerializedMaps;

    beforeEach(inject([MapEditorService, RacingUnitConversionService, MockMaps, MockSerializedMaps],
                      (injectedService: MapEditorService,
                       converterService: RacingUnitConversionService,
                       mockMapFactory: MockMaps,
                       mockSerializedMapFactory: MockSerializedMaps) => {
        service = injectedService;
        service.mapWidth = 500;
        service.mapHeight = 300;
        converter = converterService;
        mockMaps = mockMapFactory;
        mockSerializedMaps = mockSerializedMapFactory;
    }));

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(service['map']).toBeTruthy();
    });

    it('should be able to replace a previous map', () => {
        const INITIAL_MAP = service['map'];
        expect(INITIAL_MAP).toBeTruthy();

        service.newMap();
        const NEW_MAP = service['map'];
        expect(NEW_MAP).toBeTruthy();
        expect(INITIAL_MAP).not.toBe(NEW_MAP);
    });

    const CHECK_POINTS_SERIALIZATION = (map: Map, serializedMap: SerializedMap) => {
        let mapPoints: Point[];
        if (map.isClockwise()) {
            mapPoints = map.path.points.slice();
        }
        else {
            mapPoints = map.path.points.slice().reverse();
        }
        mapPoints.pop();

        expect(mapPoints.length).toEqual(serializedMap.points.length,
                                         'Not the same number of points.');

        for (let i = 0; i < mapPoints.length; ++i) {
            const MAP_POINT = mapPoints[i];
            const SMAP_POINT = serializedMap.points[i];
            const X = converter.lengthToGameUnits(MAP_POINT.x);
            const Y = converter.lengthToGameUnits(MAP_POINT.y);
            const CONVERTED_MAP_POINT = new Point(X, Y);
            expect(CONVERTED_MAP_POINT.x).toBeCloseTo(SMAP_POINT.x, 0.001,
                                                      'Points X-coordinates don\'t match');
            expect(CONVERTED_MAP_POINT.y).toBeCloseTo(SMAP_POINT.y, 0.001,
                                                      'Points Y-coordinates don\'t match');
        }
    };

    const CHECK_ITEMS_SERIALIZATION = (map: Map, serializedMap: SerializedMap) => {
        const MAP_ITEM_ARRAYS: Item[][] = [
            map.potholes,
            map.puddles,
            map.speedBoosts
        ];
        const SMAP_ITEM_ARRAYS: SerializedItem[][] = [
            serializedMap.potholes,
            serializedMap.puddles,
            serializedMap.speedBoosts
        ];
        for (let i = 0; i < MAP_ITEM_ARRAYS.length; ++i) {
            expect(MAP_ITEM_ARRAYS[i].length).toEqual(SMAP_ITEM_ARRAYS[i].length,
                                                      'Not the same number of items');
            for (let j = 0; j < MAP_ITEM_ARRAYS[i].length; ++j) {
                const MAP_ITEM = MAP_ITEM_ARRAYS[i][j];
                const SMAP_ITEM = SMAP_ITEM_ARRAYS[i][j];
                const CONVERTED_POSITION =
                    converter.lengthToGameUnits(MAP_ITEM.position);
                expect(CONVERTED_POSITION).toBeCloseTo(SMAP_ITEM.position, 0.001,
                                                       'Item positions don\'t match');
            }
        }
    };

    const CHECK_SERIALIZATION = (map: Map, serializedMap: SerializedMap, isSerialization: boolean) => {
        expect(map.name).toEqual(serializedMap.name, 'Different map names');
        expect(map.description).toEqual(serializedMap.description, 'Different descriptions');
        expect(map.type).toEqual(serializedMap.type, 'Different map types');
        CHECK_POINTS_SERIALIZATION(map, serializedMap);
        CHECK_ITEMS_SERIALIZATION(map, serializedMap);
        if (isSerialization) {
            expect(serializedMap.sumRatings).toEqual(0, 'Sum of ratings not zero');
            expect(serializedMap.numberOfRatings).toEqual(0, 'Number of ratings not zero');
            expect(serializedMap.numberOfPlays).toEqual(0, 'Number of plays not zero');
            expect(serializedMap.bestTimes.length).toEqual(0, 'Best times not empty');
        }
    };

    describe('isMapClockwise', () => {

        it('should return true when the map is valid and clockwise', () => {
            service['map'] = mockMaps.clockwise();
            expect(service.isMapClockwise).toBe(true);
        });

        it('should return false when the map is valid but is counter-clockwise', () => {
            service['map'] = mockMaps.counterClockwise();
            expect(service.isMapClockwise).toBe(false);
        });

        it('should return true when the map is invalid', () => {
            service['map'] = mockMaps.disfunctionalMap1();
            expect(service.isMapClockwise).toBe(true);
        });

    });

    describe('serializeMap', () => {

        it('should serialize maps as-is if they are valid and clockwise', () => {
            const CLOCKWISE = mockMaps.clockwise();
            service['map'] = CLOCKWISE;
            CHECK_SERIALIZATION(CLOCKWISE, service.serializeMap(), true);
        });

        it('should serialize maps reversed if they are valid and counter-clockwise', () => {
            const COUNTER_CLOCKWISE = mockMaps.counterClockwise();
            service['map'] = COUNTER_CLOCKWISE;
            CHECK_SERIALIZATION(COUNTER_CLOCKWISE, service.serializeMap(), true);
        });

        it('should not serialize maps if they are not valid', () => {
            service['map'] = mockMaps.disfunctionalMap1();
            expect(() => service.serializeMap()).toThrow();
            service['map'] = mockMaps.disfunctionalMap2();
            expect(() => service.serializeMap()).toThrow();
            service['map'] = mockMaps.emptyMap1();
            expect(() => service.serializeMap()).toThrow();
        });

        it('should not serialize maps if dimensions are not set', () => {
            service['width'] = -1;
            service['height'] = -1;

            service['map'] = mockMaps.functionalMap1();
            expect(() => service.serializeMap()).toThrow();
            service['map'] = mockMaps.disfunctionalMap1();
            expect(() => service.serializeMap()).toThrow();

            const INITIAL_WIDTH = service.mapWidth;
            service.mapWidth = 500;
            service['map'] = mockMaps.functionalMap1();
            service.serializeMap(); // Should not throw

            service['width'] = INITIAL_WIDTH;
            service['height'] = 300;
            service['map'] = mockMaps.functionalMap1();
            expect(service.serializeMap).toThrow();
        });

    });

    describe('deserializeMap', () => {

        it('should deserialize maps if they are valid', () => {
            service.mapWidth = 500;
            service.mapHeight = 300;

            const MAPS: SerializedMap[] = [
                mockSerializedMaps.functional1(),
                mockSerializedMaps.functional2()
            ];

            MAPS.forEach((map: SerializedMap, idx) => {
                service.deserializeMap(map);
                CHECK_SERIALIZATION(service.currentMap, map, false);
            });
        });

        it('should not deserialize maps if they are not valid', () => {
            const DISFUNCTIONAL_MAPS: SerializedMap[] = [
                mockSerializedMaps.disfunctional1(),
                mockSerializedMaps.disfunctional2()
            ];

            DISFUNCTIONAL_MAPS.forEach((map: SerializedMap) => {
                expect(() => service.deserializeMap(map)).toThrow();
            });
        });

        it('should not deserialize maps if either width or height is not set', () => {
            service['width'] = -1;
            service['height'] = -1;

            const FUNCTIONAL = mockSerializedMaps.functional1();
            expect(() => service.deserializeMap(FUNCTIONAL)).toThrow();
            const DISFUNCTIONAL = mockSerializedMaps.disfunctional1();
            expect(() => service.deserializeMap(DISFUNCTIONAL)).toThrow();
        });

    });


    it('should be able to check if a path loops back', () => {
        service['map'] = mockMaps.functionalMap1();
        expect(service['map'].isClosed()).toBe(true);
        service['map'] = mockMaps.emptyMap1();
        expect(service['map'].isClosed()).toBe(false);
    });

    it('should be able to add a valid point', () => {
        service['map'] = mockMaps.emptyMap1();
        service['map']['height'] = 500;
        service['map']['width'] = 500;

        expect(service['map'].path.points.length).toBe(0);
        const VALID_POINT: Point = new Point(3, 4);
        service.pushPoint(VALID_POINT);
        expect(service['map'].path.points.length).toBe(1);
        expect(service['map'].path.points).toContain(VALID_POINT);

        const INVALID_POINT: Point = new Point(1, 10000);
        service.pushPoint(INVALID_POINT);
        expect(service['map'].path.points.length).toBe(1);
        expect(service['map'].path.points).not.toContain(INVALID_POINT);
    });

    it('should be able to delete a point', () => {
        service['map'] = mockMaps.emptyMap1();
        const POINT: Point = new Point(3, 4);
        service['map'].path.points.push(POINT);

        expect(service['map'].path.points.length).toBe(1);
        service.popPoint();
        expect(service['map'].path.points.length).toBe(0);
    });

    it('should be able to edit a point', () => {
        service['map'] = mockMaps.functionalMap1();

        service.editPoint(0, new Point(3, 3));
        expect(service['map'].path.points[0].x).toBe(3);
        expect(service['map'].path.points[0].y).toBe(3);
        service.editPoint(0, new Point(-100, 10000));
        expect(service['map'].path.points[0].x).not.toBe(-100);
        expect(service['map'].path.points[0].y).not.toBe(10000);
    });

    it('should provide points', () => {
        service['map'] = mockMaps.functionalMap1();

        expect(service.path).toEqual(mockMaps.functionalMap1().path);
    });

});
