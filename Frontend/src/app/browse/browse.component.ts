import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../_services/current-user.service';
import { BrowseService } from '../_services/browse.service';
import { FollowerRequestService } from '../_services/follower-request.service';
import * as socketIO from "socket.io-client";

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit {

  private popularGames = []
  private followerStreams = []

  private socket;


  constructor(private currentUser : CurrentUserService, private gameRequestService : BrowseService, private followerRequestService : FollowerRequestService) {


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
