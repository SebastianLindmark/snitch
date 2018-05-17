import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class BrowseService {
  private BASE_URL = "http://localhost:8000";
  
  constructor(private http: HttpClient) { }


  loadPopularGames(){
    var request = this.http.post<any>(this.BASE_URL + '/get_games',{});
    return request.map((res : any) => {  
      return res.result;
    }
    );
  }

  loadGame(gameName){
    var request = this.http.post<any>(this.BASE_URL + '/get_game',{game_name:gameName});
    return request.map((res : any) => {  
      return res.result;
    }
    );
  }



}
