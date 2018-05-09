import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { User } from '../_models/user';

@Injectable()
export class SettingsService {

  private BASE_URL = "http://localhost:8000";
  
  private stream_key;


  constructor(private http : HttpClient) { 

  }

  getStreamKey(){
    var request = this.http.post<User>(this.BASE_URL + '/get_stream_key',{});
    return request.map((res : any) => {  
      return res.key;
    }
  );
}

}