import * as express from 'express';

import { MiddleWare, Route } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';
import { provideDatabase } from '../../app-db';
import { MapDbService } from './maps-db-service';
import { SerializedMap } from '../../common/racing/serialized-map';

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
                res.send();
            })
            .catch((reason: HttpStatus) => {
                res.sendStatus(reason);
            });
    }

    @Route('post', '')
    public postMaps(req: express.Request,
                    res: express.Response): void {
        const SERIALIZED_MAP: SerializedMap = req.body;
        MapsMiddleWare.MAP_DB_SERVICE.saveNew(SERIALIZED_MAP)
            .then((id: number) => {
                res.status(HttpStatus.CREATED);
                res.json(id);
                res.send();
            })
            .catch((reason: HttpStatus) => {
                res.sendStatus(reason);
            });
    }

    @Route('put', '')
    public putMaps(req: express.Request,
                   res: express.Response): void {
        MapsMiddleWare.MAP_DB_SERVICE.saveEdited(req.body)
            .then(() => {
                res.sendStatus(HttpStatus.OK);
            })
            .catch((reason: HttpStatus) => {
                res.sendStatus(reason);
            });
    }

    @Route('delete', '/:name')
    public deleteMaps(req: express.Request,
                      res: express.Response): void {
        MapsMiddleWare.MAP_DB_SERVICE.delete(req.params.name)
            .then(() => {
                res.sendStatus(HttpStatus.OK);
            })
            .catch((reason: HttpStatus) => {
                res.sendStatus(reason);
            });
    }

}
