import { Component, OnInit, Input } from '@angular/core';
import * as Globals from 'globals';


@Component({
  selector: 'app-stream-thumbnail',
  templateUrl: './stream-thumbnail.component.html',
  styleUrls: ['./stream-thumbnail.component.scss']
})
export class StreamThumbnailComponent implements OnInit {

  

  @Input() mapPath:string;
  
  private imagePath = "";
  private serverPath;

  private gifName = "video.gif"
  private imageName = "image.png"

  constructor() { 

    this.serverPath = Globals.DB_BASE_URL;
    this.imagePath = this.serverPath + "/" + this.mapPath + "/" + this.gifName;
  }

  ngOnInit() {
    
  }

  mouseEnter(){
    if(this.imageName !== this.serverPath + "/" + this.mapPath + "/" + this.gifName){
      this.imagePath = this.serverPath + "/" + this.mapPath + "/" + this.gifName;
    }
  }

  mouseLeave(){
    if(this.imageName !== this.serverPath + "/" + this.mapPath + "/" + this.imageName){
      this.imagePath = this.serverPath + "/" + this.mapPath + "/" + this.imageName;
    }
  }


  errorLoadImage(){
    //Use default
    
    if(this.imageName !== this.serverPath + "/" + this.mapPath + "/" + this.imageName){
      this.imagePath = this.serverPath + "/" + this.mapPath + "/" + this.imageName;
    }
  }






}
