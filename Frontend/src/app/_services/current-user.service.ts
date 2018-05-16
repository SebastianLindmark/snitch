import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Observable,  } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {AuthenticationService} from '../_services/authentication.service'
import { UserRequestService } from './user-request.service';

@Injectable()
export class CurrentUserService {

  private stateObserver$ = new BehaviorSubject<any>({loggedIn: false, user : null});

  constructor(private userRequest : UserRequestService) { 
    var savedToken = localStorage.getItem("user-token")
    
    if(savedToken != null ){
      this.loadUser(savedToken);
    }
  }

  public setUser(u : User){
    this.stateObserver$.next({loggedIn : true, user : u});
  }

  public loadUser(token){
    this.userRequest.getCurrentUser(token).subscribe(data => {
      var jsonUser = data;
      var user = new User(jsonUser.id, jsonUser.email, jsonUser.username);
      this.setUser(user);
    });
  }


  public logoutUser(){
    //this.stateObserver$.next({loggedIn : false, user : null});
    localStorage.removeItem("user-token");
    window.location.reload();
  }

  public registerState() : Observable<any>{
    return this.stateObserver$;
  }



}
