import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { User } from '../_models/user';

@Injectable()
export class AuthenticationService {

  private BASE_URL = "http://localhost:8000";

  constructor(private http : HttpClient) { }

  login(username : string, password : string){
      var request = this.http.post<User>(this.BASE_URL + '/api/user/login',{username: username, password : password});
      return request.map((res : User) => {
        console.log("Received response");
        console.log(res);   

        return res;
      }
    );
  }


}
