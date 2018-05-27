import { Injectable } from '@angular/core';

import flvjs from 'flv.js';
import * as hls from 'hls.js';
import { BrowseService } from '../_services/browse.service';
import * as Globals from 'globals';
import { UserRequestService } from './user-request.service';
import { VodRequestService } from './vod-request.service';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class VideoPlayerService {

  private isLive = true;
  private streamData = <any>{}
  private flvPlayer = null;
  private hlsPlayer = null;

  constructor(private route: ActivatedRoute, private userRequest : UserRequestService, private gameRequestService : BrowseService, private vodRequestService : VodRequestService) { 
  }

 

  loadLivePlayer(username,playerWindow, videoInfoCallback){
    this.resetPlayers()
    this.loadUserOnlineData(username, playerWindow, videoInfoCallback)
  }

  loadVODPlayer(vodID, playerWindow, videoInfoCallback){
    this.resetPlayers()
    this.loadUserOfflineData(vodID,playerWindow,videoInfoCallback)
  }



  loadUserOnlineData(username, playerWindow, videoInfoCallback){
//    let username = this.route.snapshot.url[1].toString();
    var request = this.userRequest.getUserStreamKey(username);
    request.subscribe(response => {
      let streamKey = response;

     if (flvjs.isSupported()) {
        let videoElement = playerWindow//<HTMLMediaElement>document.getElementById('videoElement');
        this.flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: Globals.STREAM_BASE_URL + '/live/' + streamKey + '.flv'           
        });
        this.flvPlayer.attachMediaElement(videoElement);
        this.flvPlayer.load();
        this.flvPlayer.play();
      } 
    },
    error => {
      console.log(error);
      console.log("not retreive key");
    });

    this.userRequest.getUserProfile(username).subscribe(response => {
      if(response.success){
        let streamTitle = response.result.title;
        let game = response.result.game
        videoInfoCallback(streamTitle,game)        
      }
    })
  }

  loadUserOfflineData(vodID,playerWindow,videoInfoCallback){
    var request = this.vodRequestService.getVODById(vodID)
      
    
    request.subscribe(response => {
      
      if(hls.isSupported()){
        let videoElement = playerWindow //<HTMLVideoElement>document.getElementById('videoElement');
        this.hlsPlayer = new hls();
        let vodPath = response.result.path

        this.hlsPlayer.loadSource(Globals.VOD_BASE_URL + vodPath)
        this.hlsPlayer.attachMedia(videoElement)
        this.hlsPlayer.on(hls.Events.MANIFEST_PARSED,function() {
          videoElement.play();
      });

      }
      let streamTitle = response.result.title
      let game = response.result.title;
      videoInfoCallback(streamTitle,game)
    })
  }

  private resetPlayers(){
    if(this.flvPlayer !== null){
      this.flvPlayer.pause();
      this.flvPlayer.unload();
      this.flvPlayer.detachMediaElement();
      this.flvPlayer.destroy();
      this.flvPlayer = null;
    }

    if(this.hlsPlayer !== null){
      this.hlsPlayer.destroy()
    }
  }




}
