import { Component, OnInit} from '@angular/core';
import {UserRequestService} from '../_services/user-request.service'
import {Router, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router'
import flvjs from 'flv.js';
import * as hls from 'hls.js';
import { BrowseService } from '../_services/browse.service';
import * as Globals from 'globals';


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
  private flvPlayer = null;

  constructor(private route: ActivatedRoute, private userRequest : UserRequestService, private gameRequestService : BrowseService) { 
    this.username = this.route.snapshot.url[1].toString();
  }
  
  ngAfterViewInit(){
    var request = this.userRequest.getUserStreamKey(this.username);
    request.subscribe(response => {
      this.streamKey = response;


      if(hls.isSupported()){
        let videoElement = <HTMLVideoElement>document.getElementById('videoElement');
        var streaming = new hls();
        streaming.loadSource('http://127.0.0.1:8000/live/snitch_live_csrPcslTpdCe0wHi6ZgBSl3Bx9IZ3tbgEZuv2Gh2ezvUxd9mOV/DBHVCHVcfl/index.m3u8')
        streaming.attachMedia(videoElement)
        streaming.on(hls.Events.MANIFEST_PARSED,function() {
          videoElement.play();
      });

      }
      else if (flvjs.isSupported()) {
        let videoElement = <HTMLMediaElement>document.getElementById('videoElement');
        this.flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: Globals.STREAM_BASE_URL + '/live/' + this.streamKey + '.flv'           
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


    this.userRequest.getUserProfile(this.username).subscribe(response => {
      if(response.success){
        this.streamTitle = response.result.title;
        this.loadGameIcon(response.result.game)
        
      }
    })
  }

  loadGameIcon(game){
    this.gameRequestService.loadGame(game).subscribe(response => {
      console.log(response)
      if(response.success){
        this.gameInfo = response.result;
      }
    })
  }

  toggleChat(){
    this.chatOpen = !this.chatOpen;
  }

  ngOnDestroy(){
    console.log("OnDestroy")
    if(this.flvPlayer !== null){
      this.flvPlayer.pause();
      this.flvPlayer.unload();
      this.flvPlayer.detachMediaElement();
      this.flvPlayer.destroy();
      this.flvPlayer = null;
    }
  }

}
