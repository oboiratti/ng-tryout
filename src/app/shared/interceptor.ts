import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/do';

import { User } from "../auth/auth.model";
import { Toast } from "./message_helper";

@Injectable()
export class Interceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        const currentUser: User = JSON.parse(localStorage.getItem("currentUser"));
        let authReq = req.clone();
        if (currentUser) {
            authReq = req.clone({ setHeaders: { Authorization: `Bearer ${currentUser.token}` } });
        }

        return next
            .handle(authReq)
            .do((response: HttpResponse<any>) => {
                if (response.status === 200 && req.method !== 'GET') {
                    Toast.show(response.body.msg, response.body.success);
                }
            },
            err => {
                if (err.message) Toast.error(err.message);
                else if (err.error) Toast.error(err.error.error);
            });
    }

}