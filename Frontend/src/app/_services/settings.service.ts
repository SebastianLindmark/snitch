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
    var request = this.http.post<User>(this.BASE_URL + '/protected/get_stream_key',{});
    return request.map((res : any) => {  
<<<<<<< HEAD
        return res.key;
      }
    );
  }
  changeUsername(username : string){
      var request = this.http.post<User>(this.BASE_URL + '/change_username', {username : username});
      return request.map((res : any) => {
        return res;
      });
  }
=======
      return res.result.key;
    }
  );
}
>>>>>>> 646f02d038a1224662b68a54d1e553bcaad6954e

}
