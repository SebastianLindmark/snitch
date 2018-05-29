import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../_services/current-user.service';
import { BrowseService } from '../_services/browse.service';
import { FollowerRequestService } from '../_services/follower-request.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  public text = "Please sign in";
  private popularGames = []
  private followerStreams = []

  constructor(private currentUser : CurrentUserService, private gameRequestService : BrowseService, private followerRequestService : FollowerRequestService) {
     
    this.currentUser.registerState().subscribe((response : any) => {
      if(response.logged_in){
        this.text = "Welcome " + response.user.username;
      }        
    });

    this.loadPopularGames()
   }

   loadPopularGames(){

    this.gameRequestService.loadPopularGames().subscribe(response => {
      this.popularGames = response;
    },
    error => {
      console.log(error);
    });
   }

  

  ngOnInit() {
    this.followerRequestService.getFollowerStreams().subscribe(response => {
      this.followerStreams = response.result
    })
  }


}
