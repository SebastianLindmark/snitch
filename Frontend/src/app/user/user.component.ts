import { Component, OnInit,ElementRef} from '@angular/core';
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
  constructor(private elementRef : ElementRef, private urlService: UrlService) { }

  ngOnInit() {
    this.username = this.urlService.url().substr(1);
    console.log(this.username);
  }
  
  ngAfterViewInit(){
    console.log("ngAfterViewInit called");

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

}