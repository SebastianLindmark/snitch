import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../_services/current-user.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  public text = "Please sign in";

  constructor(private currentUser : CurrentUserService) {
    this.currentUser.registerState().subscribe((response : any) => {
      if(response.logged_in){
        this.text = "Welcome " + response.user.username;
      }        
    });

   }

  ngOnInit() {
  }

}
