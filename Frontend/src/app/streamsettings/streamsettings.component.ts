import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../_services/settings.service';

@Component({
  selector: 'streamsettings',
  templateUrl: './streamsettings.component.html',
  styleUrls: ['./streamsettings.component.scss']
})
export class StreamsettingsComponent implements OnInit {
  public streamkey = "";

  constructor(private settings : SettingsService) { }

  ngOnInit() {
  }


  getStreamKey(){
    var streamKeyFunction = this.settings.getStreamKey();
    streamKeyFunction.subscribe(response => {
      this.streamkey = response;
    },
    error => {
      console.log(error);
      console.log("not retreive key");
    }
  );
}
}
