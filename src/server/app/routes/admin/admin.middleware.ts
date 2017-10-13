import * as express from 'express';
import { MiddleWare, Route } from '../middle-ware';
import { HttpStatus } from '../../http-response-status';
import { AdminDbService } from './admin-db.service';

@MiddleWare('/admin')
export class AdminMiddleWare {
    @Route('use')
    public originMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
        const hostHeaderIndex = req.rawHeaders.indexOf('Origin') + 1;
        const host = hostHeaderIndex ? req.rawHeaders[hostHeaderIndex] : undefined;

        res.header('Access-Control-Allow-Origin', host);
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    }

    /**
     * Login route
     */
    @Route('post', '/authentication/:password?')
    public login(req: express.Request, res: express.Response) {
        const PASSWORD: string = req.params.password || '';
        AdminDbService.get().checkPassword(PASSWORD).then((ok) => {
            if (ok) {
                req.session.isConnected = true;
                res.sendStatus(HttpStatus.ACCEPTED);
            }
            else {
                req.session.isConnected = false;
                res.sendStatus(HttpStatus.UNAUTHORIZED);
            }
        }).catch((reason) => {
            req.session.isConnected = false;
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        });
    }

    @Route('get', '/authentication')
    public checkLogin(req: express.Request, res: express.Response) {
        if (req.session.isConnected) {
            res.sendStatus(HttpStatus.OK);
        }
        else {
            res.sendStatus(HttpStatus.UNAUTHORIZED);
        }
    }
}
