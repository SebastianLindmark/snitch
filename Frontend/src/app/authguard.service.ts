import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service'

/*
 * Routing guard used for pages that are only allowed if the user is logged in, solely front-end protection.
 */
@Injectable()
export class AuthGuardService implements CanActivate{

  constructor(public auth: AuthenticationService, public router: Router) {}
  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

}
