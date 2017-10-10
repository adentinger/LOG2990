import * as express from 'express';

import { MiddleWare, Route } from '../middle-ware';
import { HttpStatus, getStatusOrDefault } from '../../http-response-status';
import { provideDatabase } from '../../app-db';
import { MapDbService } from './maps-db-service';

@MiddleWare('/racing/map-names')
export class MapNamesMiddleWare {

    private static readonly MAP_DB_SERVICE: MapDbService =
        new MapDbService(provideDatabase());

    @Route('get', '/:count')
    public getMapNames(req: express.Request,
                       res: express.Response,
                       next: express.NextFunction): void {
        const COUNT: number = req.params.count;
        MapNamesMiddleWare.MAP_DB_SERVICE.getMapNames(COUNT)
            .then((names: string[]) => {
                res.status(HttpStatus.OK);
                res.json(names);
                res.send();
            })
            .catch((reason: any) => {
                res.sendStatus(getStatusOrDefault(reason));
            });
    }

}
