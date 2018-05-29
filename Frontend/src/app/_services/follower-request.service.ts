import { Injectable } from '@angular/core';
import * as Globals from 'globals';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class FollowerRequestService {

  private BASE_URL = Globals.DB_BASE_URL;

  constructor(private http : HttpClient) { }


  isFollower(username : string){
    var request = this.http.post<any>(this.BASE_URL + '/is_following', {username : username});
    return request.map((res : any) => {
      return res;
    });
  }

  followUser(username : string){
    var request = this.http.post<any>(this.BASE_URL + '/follow_user', {username : username});
    return request.map((res : any) => {
      return res;
    });
  }

  followUserRemove(username : string){
    var request = this.http.post<any>(this.BASE_URL + '/follow_user_remove', {username : username});
    return request.map((res : any) => {
      return res;
    });
  }

  getFollowers(username : string){
    var request = this.http.post<any>(this.BASE_URL + '/get_followers', {username : username});
    return request.map((res : any) => {
      return res;
    });
  }


  getFollowerStreams(){
    var request = this.http.post<any>(this.BASE_URL + '/get_follower_streams', {});
    return request.map((res : any) => {
      return res;
    });
  }

  


}
