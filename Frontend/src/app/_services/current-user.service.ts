import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Observable,  } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {AuthenticationService} from '../_services/authentication.service'
import { UserRequestService } from './user-request.service';

@Injectable()
export class CurrentUserService {

  private stateObserver$ = new BehaviorSubject<any>({logged_in: false, user : null});

  constructor(private userRequest : UserRequestService, private authentication : AuthenticationService) { 
    var savedToken = localStorage.getItem("user-token")
    
    
    if(savedToken != null ){
      console.log("Loading current user");
      userRequest.getCurrentUser(savedToken).subscribe(data => {
        console.log("Received current user response");
        var jsonUser = JSON.parse(data);
        var user = new User(jsonUser.id, jsonUser.email, jsonUser.username);
        this.setUser(user);
      });
    }
  }

  public setUser(u : User){
    localStorage.setItem("user-token",JSON.stringify(u));  
    this.stateObserver$.next({logged_in : true, user : u});
  }


  public removeUser(){
    localStorage.removeItem("user-token");
    this.stateObserver$.next({logged_in : false, user : null});
  }

  public registerState() : Observable<User>{
    return this.stateObserver$;
  }



}
