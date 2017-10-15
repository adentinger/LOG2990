import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Logger, warn } from '../common';
import { AdminConfigService } from './admin-config.service';

@Injectable()
export class AdminAuthGard implements CanActivate {

    private readonly logger = Logger.getLogger('AdminAuthGuard');

    constructor(private adminConfig: AdminConfigService) { }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
            return this.adminConfig.isLoggedIn().then((isConnected) => {
                if (!isConnected) {
                    const password = window.prompt('You have to be logged in to have access to this page') || '';
                    return this.adminConfig.login(password).then((isLoggedIn) => {
                        if (!isLoggedIn) {
                            alert('Wrong password');
                        }
                        return isLoggedIn;
                    });
                }
                return isConnected;
            }).catch(warn(this.logger, false));
    }
}
