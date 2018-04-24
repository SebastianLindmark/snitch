import { Component, OnInit, Input,NgZone, ViewChild,ElementRef, Output, EventEmitter } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service'
import {UIRouterModule} from "@uirouter/angular";
import { User } from '../_models/user';
import { CurrentUserService } from '../_services/current-user.service';
declare const gapi: any;

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  private displaySignIn = false;

  @Input() 
  set showLogIn(showLogIn: boolean) {
    this.displaySignIn = showLogIn;
  }

  @Input() close: boolean;
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  public username = "";
  public email = "";
  public password = "";
  public passwordAgain = "";

  constructor(private zone: NgZone, private authentication : AuthenticationService, private currentUser : CurrentUserService) { }


  public activePage = "active";

  signUpTab(){
    this.displaySignIn = false;
  }

  signInTab(){
    this.displaySignIn = true;
  }

  public closeThisComponent(){
    console.log("Running emit");
    this.closeEvent.emit(true);
  }

  passwordMatches(){
    return this.password == this.passwordAgain
  }

  logIn(){
      this.authentication.login(this.username,this.password).subscribe(data => {
        this.currentUser.setUser(data);
        this.closeEvent.emit(true);
      },
    
      error => {
        console.log("not retreive user");
      }
    );
  }


  register(){

    this.authentication.register(this.username,this.email,this.password).subscribe(data => {
      this.logIn();
    },

    error => {
      console.log("Could not register user");
      console.log(error);
    }
  );
  }


  public auth2: any;
  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '160715832214-50hk5tjj9355otgtqjb4lsjsfhgem2r5.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }



  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {

        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        this.zone.run(() => {
          var user = new User(-1337,profile.getId(),profile.getEmail())
          this.currentUser.setUser(user);
          this.closeThisComponent();
        })
        
        
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });

  }


  ngOnInit() {
    this.googleInit();
  }



}
