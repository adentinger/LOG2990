import * as express from 'express';

import { MiddleWare, Route } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';

@MiddleWare('/racing/map-names')
export class MapNamesMiddleWare {

    @Route('get', '/:count')
    public getMapNames(req: express.Request,
                       res: express.Response,
                       next: express.NextFunction): void {
        res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
    }

}
