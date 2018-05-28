import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { UserRequestService } from './_services/user-request.service';
import { Observable } from 'rxjs/Observable';
import {Router} from '@angular/router';

/*
 * Routing guard that only allows routing to existing user pages, otherwise routes to 404.
 */
@Injectable()
export class ChannelGuardService implements CanActivate {

  constructor(private router : Router,private userRequest : UserRequestService) { }

  public canActivate(route: ActivatedRouteSnapshot) : Promise<boolean> {
    
    var username = route.url[1].toString();
    var userResponse = this.userRequest.getUser(username);
    return new Promise((resolve) =>{
        this.userRequest.getUser(username).subscribe(user => {
          resolve(true);
        },err => {
          this.router.navigate(['/404'], { skipLocationChange: true })          
          resolve(false);
        })
    });
    
  }

}
