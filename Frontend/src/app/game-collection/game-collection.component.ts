import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BrowseService } from '../_services/browse.service';

@Component({
  selector: 'app-game-collection',
  templateUrl: './game-collection.component.html',
  styleUrls: ['./game-collection.component.scss']
})
export class GameCollectionComponent implements OnInit {

  name = ""
  image_url = "";
  wide_image_url = "";
  liveStreams = []
  noStreamsAvailable = false;
  
  constructor(private gameService :BrowseService, private route: ActivatedRoute) { }

  ngOnInit() {
    var urlGame = this.route.snapshot.url[1].toString();
    let game = decodeURI(urlGame);
    this.gameService.loadGame(game).subscribe(response => {
      this.name = response.result.name;
      this.image_url = response.result.url;
      this.wide_image_url = response.result.wide_image_url;
    })


    this.gameService.loadLiveStreamsByGame(game).subscribe(response => {
      console.log(response.result);
      if(response.success && response.result.length > 0){
        this.liveStreams = response.result;
      }else if(response.success && response.result.length == 0){
        this.noStreamsAvailable = true;
      }
      
    },
    error => {
      console.log(error);
    });

    
  }

}
