import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/UserService.service';
import { PusherService } from '../_services/PusherService.service';
import { Router } from '@angular/router';
import * as GLOBAL from '../globals';

@Component({
  selector: 'app-ready',
  templateUrl: './ready.component.html',
  styleUrls: ['./ready.component.css'],
  providers: []
})
export class ReadyComponent implements OnInit {
  public user;
  public username;
  public channel;
  public members = [];
  public ready = false;
  private readiedPlayers = [];


  constructor(private userService : UserService, private pusher: PusherService, 
              private router: Router) {
  	this.user = userService.getUser();
  }

  ngOnInit() {
    this.subscribeToChannel();
  }

  private subscribeToChannel() {
    (this.pusher.subscribe(this.user.channel_id)).then((channel) => {
      this.channel = channel;
      // console.log(this.channel);
      this.bindToSubscriptionSucceeded().then(() => {
        this.getReadiedPlayersIds();
      }, (err) => {
        console.log('unresolved');
      });
    }, (err) => {
      console.log(err);
      // Go back home page
      alert('An error has occured. Returning to Home page');
      this.router.navigateByUrl('/home');
    });
  }
  private bindToSubscriptionSucceeded() {
    return new Promise((res, rej) => {
      let that = this;
      this.channel.bind('pusher:subscription_succeeded', function(members) {
         members.each(function(member) {
           that.members.push(member);
         });
         that.bindToMembersAdded();
         that.bindToMemberRemoved();
         that.bindToAllReady();
         res();
     });
     setTimeout(function() {rej();},5000);
    });
  }

  private bindToMembersAdded() {
    let that = this;
    this.channel.bind('pusher:member_added', function(member) {
      that.members.push(member);
      console.log('Member added!');
      console.log(member);
    });
  }

  private bindToMemberRemoved() { 
    let that = this;
    this.channel.bind('pusher:member_removed', function(member) {
      var index = -1;
      for(var i = 0; i < that.members.length; i++) {
        if (that.members[i].id == member.id) {
          index = i;
          break;
        }
      }
      if (index == -1) {
        console.log('Could not find player id');
        return;
      }
      that.members.splice(index, 1);
      // console.log("Member removed");
    });
  }
  /**
   * all-ready event is triggered when a player presses ready.
   * The Event will return that user_id so that clients can update their copy of
   * redied users
   * Then, checks if all 4 members have readied
   */
  private bindToAllReady() {
    let that = this;
    this.channel.bind('all-ready', function(data) {
      var allReady = true;
      for(var i = 0 ; i < that.members.length; i++) {
        if (that.members[i].id == data.user_id) {
          that.members[i].info.ready = true;
          break;
        }
      }
      // console.log(that.members);
      if (that.members.length == GLOBAL.number_of_players ) {
        for(var i = 0; i < that.members.length; i++) {
          if (that.members[i].info.ready == false) {
            allReady = false;
            break;
          }
        }
        // console.log(that.members);
        if (allReady) {
          // TODO: should have 1 second loading screen for fun
          that.router.navigateByUrl('/game');
        }
      }
    });
  }

  public readyUp() { 
    // TODO: Report to server that Im ready
    this.pusher
      .readyUp(this.user.id, this.user.channel_id)
      .subscribe(
        ready => this.ready = true,
        error => this.ready = false
      )
  }

  private setReadiedPlayers(data) {
    let users = data.users;
    if (users.length > 0) {
      for (var i = 0 ; i < users.length; i++) {
        for(var j = 0; j < this.members.length; j++) {
          if (this.members[j].id == users[i]) {
            this.members[j].info.ready = true;
            break;
          }
        }
      }
    }
  }

  private getReadiedPlayersIds() {
    this.pusher
      .getReadiedPlayerIds(this.user.channel_id)
      .subscribe(
        data => this.setReadiedPlayers(data),
        error => console.log(error)
       )
  }

}
