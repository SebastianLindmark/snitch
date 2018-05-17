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
  popularGames = []
  constructor(private gameService :BrowseService, private route: ActivatedRoute) { }

  ngOnInit() {
    var urlGame = this.route.snapshot.url[1].toString();
    let game = decodeURI(urlGame);
    this.gameService.loadGame(game).subscribe(response => {
      this.name = response.name;
      this.image_url = response.url;
      this.wide_image_url = response.wide_image_url;
    })

    this.gameService.loadPopularGames().subscribe(response => {
      this.popularGames = response;
    },
    error => {
      console.log(error);
    });

    
  }

}
