import { Component, OnInit} from '@angular/core';
import {UserRequestService} from '../_services/user-request.service'
import {Router, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router'
import flvjs from 'flv.js';
import * as hls from 'hls.js';
import { BrowseService } from '../_services/browse.service';
import * as Globals from 'globals';
import { VodRequestService } from '../_services/vod-request.service';
import { VideoPlayerService } from '../_services/video-player.service';
import { FollowerRequestService } from '../_services/follower-request.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent  {
  public username: string;
  public url : string[];
  public streamKey = "";
  public chatOpen = true;
  public streamTitle = ""
  private gameInfo;

  private isLive = true;
  private selectedTabIndex = 0;

  private vodSelected = false;

  private isFollowing = false;
  private followers = []
  private vods = []

  constructor(private route: ActivatedRoute, private userRequest : UserRequestService,
    private gameRequestService : BrowseService, private vodRequestService: VodRequestService, private videoPlayer : VideoPlayerService, private followRequestService : FollowerRequestService) { 
    this.username = this.route.snapshot.url[1].toString();
  }

  loadLivePlayer(){
      this.vodSelected = false
      let playerWindow = <HTMLVideoElement>document.getElementById('videoElement')
      let selfRef = this;
      this.videoPlayer.loadLivePlayer(this.username,playerWindow,function(videoTitle, gameId){
        selfRef.loadVideoInformation(selfRef,videoTitle,gameId)
      })
  }

  loadVODPlayer(vodID){
    this.vodSelected = true
    let playerWindow = <HTMLVideoElement>document.getElementById('videoElement')
    let selfRef = this;
    this.videoPlayer.loadVODPlayer(vodID,playerWindow,function(videoTitle, gameId){
      selfRef.loadVideoInformation(selfRef,videoTitle,gameId)
    })
  }


  loadVideoInformation(selfRef,videoTitle, gameId){
    selfRef.streamTitle = videoTitle
    selfRef.gameRequestService.loadGame(gameId).subscribe(response => {
      console.log(response)
      if(response.success){
        selfRef.gameInfo = response.result;
        console.log(selfRef.gameInfo)
      }
    })
  }
  
  toggleChat(){
    this.chatOpen = !this.chatOpen;
  }   

  ngAfterViewInit(){
    this.loadLivePlayer()
    this.loadVODS()
    this.isFollower()
    this.gameRequestService.getViewersByGame().subscribe(response => {
      console.log(response)
    })
  }

  isFollower(){
    this.followRequestService.isFollower(this.username).subscribe(response => {
      if(response.success){
        console.log("Is follower " + response.result)
        this.isFollower = response.result
      }
    })
  }

  followButton(){
    if(!this.isFollower){
      this.followRequestService.followUser(this.username).subscribe(handleFollowResponse)
    }else{
      this.followRequestService.followUserRemove(this.username).subscribe(handleFollowResponse)
    }

    let selfRef = this;
    function handleFollowResponse(response){  
      selfRef.isFollower = response.result;
    }

  }

  loadVODS(){
    this.vodRequestService.getVODSByUser(this.username).subscribe(response => {
      if(response.success){
        for(var i = 0; i < response.result.length; i++){
          let date = new Date(response.result[i].createdAt);
          let dateString = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
          response.result[i].date = dateString;
        }
        this.vods = response.result;
      }
    })
  }

  loadFollowers(){
    let selfRef = this
    this.followRequestService.getFollowers(this.username).subscribe(response => {
      selfRef.followers = response.result
    })
  }

  playVOD(vodID){
    this.loadVODPlayer(vodID)
  }

  tabClick(tabIndex){
    this.selectedTabIndex = tabIndex
    if(tabIndex == 0){
      this.loadLivePlayer()
    }else if(tabIndex == 2){
      this.loadFollowers()
    }
  }
}
