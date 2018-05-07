import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Injectable } from '@angular/core';
import { User } from '../_models/user';

@Injectable()
export class UserRequestService {

  private BASE_URL = "http://localhost:8000";

  constructor(private http : HttpClient) { }


  getCurrentUser(token : string){
    var request = this.http.post<User>(this.BASE_URL + '/get_user',{token: token});
    return request.map((res : any) => {  
      return res;
    }
  );
}


}
