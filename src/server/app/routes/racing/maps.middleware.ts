import * as express from 'express';

import { MiddleWare, Route } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';

@MiddleWare('/racing/maps')
export class MapsMiddleWare {

    @Route('get', '/:name')
    public getMaps(req: express.Request,
                    res: express.Response,
                    next: express.NextFunction): void {
        res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
    }

    @Route('post', '')
    public postMaps(req: express.Request,
                    res: express.Response,
                    next: express.NextFunction): void {
        res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
    }

    @Route('put', '/:name')
    public putMaps(req: express.Request,
                   res: express.Response,
                   next: express.NextFunction): void {
        res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
    }

    @Route('delete', '/:name')
    public deleteMaps(req: express.Request,
                res: express.Response,
                next: express.NextFunction): void {
        res.sendStatus(HttpStatus.NOT_IMPLEMENTED);
    }

}
