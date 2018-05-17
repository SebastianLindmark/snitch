import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { User } from '../_models/user';
import { JwtHelper } from 'angular2-jwt';
import {CurrentUserService} from '../_services/current-user.service'

@Injectable()
export class AuthenticationService {

  private BASE_URL = "http://localhost:8000";

  constructor(private currentUserService : CurrentUserService, private http : HttpClient, public jwtHelper: JwtHelper) {   }

  loginCustomUser(username : string, password : string){
      var request = this.http.post<User>(this.BASE_URL + '/api/user/custom_login',{username: username, password : password});
      return request.map((res : any) => {  
        localStorage.setItem("user-token",res.token);  
        return res;
      }
    );
  }

  loginGoogleAccount(username : string, email : string, googleID : string){
    console.log("Sending login request");
    var request = this.http.post<User>(this.BASE_URL + '/api/user/google_login',{username: username, email : email, googleID : googleID});
      return request.map((res : any) => {
        localStorage.setItem("user-token",res.token);  
        return res.token;
      }
    );
  }

  registerCustomUser(username : string, email : string, password : string){
    var request = this.http.post<any>(this.BASE_URL + '/api/user/custom_signup',{username: username, email : email, password : password});
    return request.map((res : any) => {  
      return res;
    }
  )}

  registerGoogleUser(username : string, email : string, googleID : string){
    var request = this.http.post<any>(this.BASE_URL + '/api/user/google_signup',{username: username, email : email, googleID : googleID});
    return request.map((res : any) => {  
      return res;
    }
  );
}

// ...
public isAuthenticated(): boolean {
  const token = localStorage.getItem('user-token');
  if(token){
    return !this.jwtHelper.isTokenExpired(token);
  } else {
    return false;
  }
}

}
