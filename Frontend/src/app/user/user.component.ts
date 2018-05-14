import { Component, OnInit} from '@angular/core';
import {UserRequestService} from '../_services/user-request.service'
import {Router, ActivatedRouteSnapshot, ActivatedRoute} from '@angular/router'
import flvjs from 'flv.js';



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

  constructor(private route: ActivatedRoute, private userRequest : UserRequestService) { 
    this.username = this.route.snapshot.url[1].toString();
  }
  
  ngAfterViewInit(){
    var request = this.userRequest.getUserStreamKey(this.username);
    request.subscribe(response => {
      this.streamKey = response;
      if (flvjs.isSupported()) {
        var videoElement = <HTMLMediaElement>document.getElementById('videoElement');
        var flvPlayer = flvjs.createPlayer({
            type: 'flv',
            url: 'http://localhost:8080/live/' + this.streamKey + '.flv'           
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
      } 
    },
    error => {
      console.log(error);
      console.log("not retreive key");
    });
  }

  toggleChat(){
    this.chatOpen = !this.chatOpen;
  }

}
