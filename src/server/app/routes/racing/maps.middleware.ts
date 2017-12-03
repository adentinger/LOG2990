import * as express from 'express';

import { MiddleWare, Route } from '../middle-ware';
import { HttpStatus, getStatusOrDefault } from '../../../../common/src';
import { provideDatabase } from '../../app-db';
import { MapDbService } from './map-db-service';
import { SerializedMap } from '../../../../common/src/racing/serialized-map';
import { MapUpdater } from './map-updater';

@MiddleWare('/racing/maps')
export class MapsMiddleWare {

    private static readonly MAP_DB_SERVICE: MapDbService =
        new MapDbService(provideDatabase());

    @Route('get', '/:name')
    public getMaps(req: express.Request,
                   res: express.Response): void {
        MapsMiddleWare.MAP_DB_SERVICE.getByName(req.params.name)
            .then((serializedMap: SerializedMap) => {
                res.status(HttpStatus.OK);
                res.json(serializedMap);
            })
            .catch((reason: any) => {
                res.sendStatus(getStatusOrDefault(reason));
            });
    }

    @Route('post', '/')
    public postMaps(req: express.Request,
                    res: express.Response): void {
        const SERIALIZED_MAP: SerializedMap = req.body;
        MapsMiddleWare.MAP_DB_SERVICE.saveNew(SERIALIZED_MAP)
            .then(() => {
                res.sendStatus(HttpStatus.CREATED);
            })
            .catch((reason: any) => {
                res.sendStatus(getStatusOrDefault(reason));
            });
    }

    @Route('put', '/')
    public putMaps(req: express.Request,
                   res: express.Response): void {
        MapsMiddleWare.MAP_DB_SERVICE.saveEdited(req.body)
            .then(() => {
                res.sendStatus(HttpStatus.OK);
            })
            .catch((reason: any) => {
                res.sendStatus(getStatusOrDefault(reason));
            });
    }

    @Route('delete', '/:name')
    public deleteMaps(req: express.Request,
                      res: express.Response): void {
        MapsMiddleWare.MAP_DB_SERVICE.delete(req.params.name)
            .then(() => {
                res.sendStatus(HttpStatus.OK);
            })
            .catch((reason: any) => {
                res.sendStatus(getStatusOrDefault(reason));
            });
    }

    @Route('patch', '/:name/time/:time')
    public updateMapBestTime(req: express.Request,
                             res: express.Response): void {
        MapUpdater.getInstance()
            .updateTime(req.params.name, Number(req.params.time))
            .then(() => res.sendStatus(HttpStatus.OK))
            .catch((reason: any) => res.sendStatus(getStatusOrDefault(reason)));
    }

    @Route('patch', '/:name/rating/:rating')
    public updateMapRating(req: express.Request,
                           res: express.Response): void {
        MapUpdater.getInstance()
            .updateRating(req.params.name, Math.round(Number(req.params.rating)))
            .then(() => res.sendStatus(HttpStatus.OK))
            .catch((reason: any) => res.sendStatus(getStatusOrDefault(reason)));
    }

}
