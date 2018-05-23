import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import * as Globals from 'globals';

@Injectable()
export class UserRequestService {

  private BASE_URL = Globals.DB_BASE_URL;

  constructor(private http : HttpClient) { }

  getUserStreamKey(username : string){
    var request = this.http.post<User>(this.BASE_URL + '/get_user_stream_key', {username : username});
    return request.map((res : any) => {
      return res.result.key;
    });
  }

  getUser(username : string){
    var request = this.http.post<User>(this.BASE_URL + '/get_user',{username : username});
    return request.map((res : any) => {  
      return res;
    }
  );
}

  getCurrentUser(token : string){
    var request = this.http.post<User>(this.BASE_URL + '/get_logged_in_user',{});
    return request.map((res : any) => {  
      return res;
    }
  );
}

updateUserProfile(title, game){
  var request = this.http.post<User>(this.BASE_URL + '/update_user_profile',{title:title, game_name:game});
  return request.map((res : any) => {  
    return res;
  })
  
}

getUserProfile(username){
  var request = this.http.post<User>(this.BASE_URL + '/get_user_profile',{username:username});
  return request.map((res : any) => {  
    return res;
  })
}


}
