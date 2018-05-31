import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../_services/current-user.service';
import * as socketIO from "socket.io-client";
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  private activeUser;
  private socket;
  private roomName;
  private messages = [];
  private message;

  constructor(private currentUser : CurrentUserService, private route : ActivatedRoute) { 
    this.roomName = this.route.snapshot.url[1].toString();
  }


  createRoom(){
    this.socket.emit('roomCreate', this.roomName,false, (error, data) => {

        if(error){
          console.log("Error in RoomCREATE")
          console.log(error)
        }else{
          console.log("Successfully created room");
          this.socket.emit('roomJoin', this.roomName, (error, data) => {
            if(error){
              console.log("PROBLEMS JOINING ROOM WE JUST CREATED")
            }else{
              console.log("Succesffuly JOINED ROOM WE JUST CREATED")
            }
          })
        }
    })
  }



  joinRoom(){
    this.socket.emit('roomJoin', this.roomName, (error, data) => {
      if (error) { 
        console.log("Received error in room join, trying to create room")
        console.log(error);
        this.createRoom() 
      }
      else{
        console.log("Joined room")
        this.socket.emit('roomMessage', this.roomName, { textMessage: 'Hello!' })
      }   
    })
  }

  sendMessage(message) {
    this.socket.emit('roomMessage', this.roomName, { textMessage: message })
    this.message = "";
  }

  initChatComponents(){
      console.log("Init chat components")
      this.socket.on('roomMessage', (room, msg) => {
        this.messages.push(msg);
        console.log(`${msg.author}: ${msg.textMessage}`)
      })
        
      // Auth success handler.
      this.socket.on('loginConfirmed', userName => {
        this.joinRoom()
        // Join room named 'default'.
        
      })
      
      // Auth error handler.
      this.socket.on('loginRejected', error => {
        console.log("Recevied authentication error")
        console.error(error)
      })
    }


  
  ngOnInit(){
    let url = 'ws://localhost:8040/chat-service'
    let userName = 'user' // for example and debug
    let token = localStorage.getItem('user-token');
    let query = `token=${token}`
    let opts = { query }
    this.socket = socketIO.connect(url, opts)
    this.initChatComponents()

    /*this.currentUser.registerState().subscribe((response : any) => {
      if(response.logged_in){
        this.activeUser = response.user;
        this.initChatComponents()
      }        
    });*/
  }

}
