import { Component, OnInit} from '@angular/core';
import { UrlService } from "@uirouter/angular";
import flvjs from 'flv.js';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public username: string = "";
  public streamKey = "streamkey"
  public chatOpen = true;
  constructor(private urlService: UrlService) { }

  ngOnInit() {
    this.username = this.urlService.url().substr(1);
    console.log(this.username);
  }
  
  ngAfterViewInit(){
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
  }

  toggleChat(){
    this.chatOpen = !this.chatOpen;
  }

}
