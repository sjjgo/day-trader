import { Component, OnInit } from '@angular/core';
import { GameCodeService } from '../_services/GameCodeService.service';
import { Router } from '@angular/router';
import { UserService } from '../_services/UserService.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [GameCodeService, UserService]
})
export class HomeComponent{
	
	public info: string;
  public username: string;
  public gameCode : string;
  
  constructor(private gameCodeService: GameCodeService, private router: Router, private user : UserService) { }

  isValid(gameCodeDetails) {
  	if (gameCodeDetails.isFalse == 1) {
  		this.info = "Invalid game code";
  	}
  	else {
      // console.log(gameCodeDetails);
      this.user.save(this.username, gameCodeDetails.user_id, gameCodeDetails.channel_id);
  		this.router.navigateByUrl('/ready');
  	}
    console.log(gameCodeDetails);
  }

  usernameChange(username) {
    this.username = username;
    this.info = "";
  }

  gameCodeChange(gameCode) {
    this.gameCode = gameCode;
    this.info = "";
  }

  validate() {
  	// this.router.navigateByUrl('/ready');
  	if (!this.username) {
      this.info = "Enter a username";
      return;
    }
    if (!this.gameCode) {
      this.info = "Enter a valid game code";
  		return;
  	}
  	this.gameCodeService
  		.validate(this.gameCode, this.username)
			.subscribe(
				valid => this.isValid(valid),
				error => this.isValid({isFalse: 1})
				);
  }

}
