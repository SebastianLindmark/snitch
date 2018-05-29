import { Injectable } from '@angular/core';
import * as Globals from 'globals';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class VodRequestService {

  private BASE_URL = Globals.DB_BASE_URL;

  constructor(private http : HttpClient) { }


  getVODSByUser(username : string){
    var request = this.http.post<any>(this.BASE_URL + '/get_vods_by_user', {username : username});
    return request.map((res : any) => {
      return res;
    });
  }

  getVODById(id){
    var request = this.http.post<any>(this.BASE_URL + '/get_vod_by_id', {id : id});
    return request.map((res : any) => {
      return res;
    });
  }

  getVODSBygame(gameId){
    var request = this.http.post<any>(this.BASE_URL + '/get_vods_by_game', {id : gameId});
    return request.map((res : any) => {
      return res;
    });
  }

  

}
