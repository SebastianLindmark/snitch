import { Injectable } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class JwtInterceptorService implements HttpInterceptor{

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var userToken = localStorage.getItem("user-token");
    
    if(userToken != null){
      request = request.clone({
        setHeaders: {
          Authorization: "Bearer ".concat(userToken)
        }
      });
    }
    return next.handle(request);
  }

}
