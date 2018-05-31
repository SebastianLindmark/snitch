import { Component, OnInit } from '@angular/core';
import { UserRequestService } from '../_services/user-request.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit {


  
  constructor(private userRequestService : UserRequestService, private router : Router) { }

  ngOnInit() {
  }

  private value:any = {};
  private _disabledV:string = '0';
  private disabled:boolean = false;
  private items = [];
  

  private get disabledV():string {
    return this._disabledV;
  }

  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }

  private selected(value:any) {
    this.router.navigate(['/channel/' + value.text]);
    this.items = []
    this.refreshValue(["Empty"])
  }

  private removed(value:any) {
    this.refreshValue([])
  }

  private typed(value:any) {
    if(value.length == 1){
      this.userRequestService.searchUsers(value).subscribe(response => {
        this.items = []
        for(var i = 0; i < response.result.length; i++){
          this.items.push(response.result[i].username);
        }
      });
    }
  }

  private refreshValue(value:any) {
    this.value = value;
  }


}
