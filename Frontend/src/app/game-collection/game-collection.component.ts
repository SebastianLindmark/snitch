import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BrowseService } from '../_services/browse.service';
import { VodRequestService } from '../_services/vod-request.service';
import { StreamThumbnailComponent } from '../stream-thumbnail/stream-thumbnail.component';



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
  vods = []
  noStreamsAvailable = false;
  
  constructor(private gameService :BrowseService, private route: ActivatedRoute, private vodRequestService : VodRequestService) { }

  ngOnInit() {
    var urlGame = this.route.snapshot.url[1].toString();
    let game = decodeURI(urlGame);
    this.gameService.loadGame(game).subscribe(response => {
      console.log(response.result)
      this.name = response.result.name;
      this.image_url = response.result.url;
      this.wide_image_url = response.result.wide_image_url;
      this.loadVODsByGame(response.result.id)
    })


    this.gameService.loadLiveStreamsByGame(game).subscribe(response => {
      console.log("HERE COMES THE RESULT")
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


  loadVODsByGame(gameId){
    this.vodRequestService.getVODSBygame(gameId).subscribe(response => {
      console.log("Received VODS")
      console.log(response)
      this.vods = response.result;
    })
  }

}
