import { Component, OnInit } from '@angular/core';
import { UrlService } from "@uirouter/angular";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  public username: string = "";

  constructor(private urlService: UrlService) { }

  ngOnInit() {
    this.username = this.urlService.url().substr(1);
    console.log(this.username);
  }

}
