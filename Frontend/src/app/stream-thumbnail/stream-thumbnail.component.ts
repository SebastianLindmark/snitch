import { Component, OnInit, Input } from '@angular/core';
import * as Globals from 'globals';


@Component({
  selector: 'app-stream-thumbnail',
  templateUrl: './stream-thumbnail.component.html',
  styleUrls: ['./stream-thumbnail.component.scss']
})

/**
 * Handles how the Streams and VODS are displayed on the Browsing page.
 */
export class StreamThumbnailComponent implements OnInit {

  

  @Input() mapPath:string;
  @Input() loadGif:boolean;
  
  private imagePath = "";
  private serverPath;

  private gifName = "video.gif"
  private imageName = "image.png"
  private defaultImageSrc = "https://shadeworks.ca/wp-content/themes/ShadeWorks/woocommerce/single-product/colors/Designer%20Blackout%20Roller%20Shades/Castle%20Rock/Black.jpg"

  private shouldLoadGif;

  constructor() { 

    
  }

  ngOnInit() {
    this.serverPath = Globals.DB_BASE_URL;
    this.shouldLoadGif = this.loadGif === undefined ? false : this.loadGif;
    this.imagePath = this.serverPath + "/" + this.mapPath + "/" + this.imageName;
  }

  /**
   * Mouse enters preview image, replaces Image with GIF.
   */
  mouseEnter(){
    if(!this.shouldLoadGif){
      return;
    }

    if(this.imagePath !== this.serverPath + "/" + this.mapPath + "/" + this.gifName){
      this.imagePath = this.serverPath + "/" + this.mapPath + "/" + this.gifName;
    }
  }

  /**
   * Mouse leaves preview image, replaces GIF with Image.
   */
  mouseLeave(){
    if(this.imagePath !== this.serverPath + "/" + this.mapPath + "/" + this.imageName){
      this.imagePath = this.serverPath + "/" + this.mapPath + "/" + this.imageName;
    }
  }


  /**
   * If an image for preview couldn't be loaded.
   */
  errorLoadImage(){
    if(this.imagePath == this.defaultImageSrc){
      return;
    }

    if(this.imagePath === this.serverPath + "/" + this.mapPath + "/" + this.imageName){
      this.imagePath = this.defaultImageSrc;
    }
    else if(this.imagePath !== this.serverPath + "/" + this.mapPath + "/" + this.imageName){
      this.imagePath = this.serverPath + "/" + this.mapPath + "/" + this.imageName;
    }
  }






}
