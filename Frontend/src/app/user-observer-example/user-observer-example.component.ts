import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../_services/current-user.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-user-observer-example',
  templateUrl: './user-observer-example.component.html',
  styleUrls: ['./user-observer-example.component.scss']
})
export class UserObserverExampleComponent implements OnInit {

  constructor(private currentUser : CurrentUserService) { }

  public name = "Not logged in";

  ngOnInit() {

    this.currentUser.registerState().subscribe((response : any) => {
      if(response.logged_in){
        this.name = response.user.username;
      }  
      
    });

  }

}
