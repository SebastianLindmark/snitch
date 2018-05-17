import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../_services/current-user.service';
import { BrowseService } from '../_services/browse.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  public text = "Please sign in";
  private popularGames = []

  constructor(private currentUser : CurrentUserService, private browseService : BrowseService) {
     
    this.currentUser.registerState().subscribe((response : any) => {
      if(response.logged_in){
        //customized user content can be loaded here
        this.text = "Welcome " + response.user.username;
      }        
    });

    this.loadPopularGames()
   }

   loadPopularGames(){

    this.browseService.loadPopularGames().subscribe(response => {
      this.popularGames = response;
    },
    error => {
      console.log(error);
      console.log("not retreive key");
    });

    
   }

  ngOnInit() {
  }

}
