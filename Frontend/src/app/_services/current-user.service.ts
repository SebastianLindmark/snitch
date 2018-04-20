import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { Observable,  } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CurrentUserService {

  private stateObserver$ = new BehaviorSubject<any>({logged_in: false, user : null});

  constructor() { 
    var savedUser = localStorage.getItem("user")
    if(savedUser != null && JSON.parse(savedUser).username != undefined){
      var jsonUser = JSON.parse(savedUser);
      var user = new User(jsonUser.id, jsonUser.email, jsonUser.username);
      this.setUser(user);
    }
  }

  public setUser(u : User){
    localStorage.setItem("user",JSON.stringify(u));  
    this.stateObserver$.next({logged_in : true, user : u});
  }

  public registerState() : Observable<User>{
    return this.stateObserver$;
  }

  public removeUser(){
    localStorage.removeItem("user");
    this.stateObserver$.next({logged_in : false, user : null});
  }


}
