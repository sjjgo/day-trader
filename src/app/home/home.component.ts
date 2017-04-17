import { Component, OnInit } from '@angular/core';
import { GameCodeService } from './gamecode.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [GameCodeService]
})
export class HomeComponent{
	
	public info: string;
  
  constructor(private gameCodeService: GameCodeService) { }

  isValid(gameCodeDetails) {
  	if (gameCodeDetails.isFalse == 1 || gameCodeDetails.activated_count > 4) {
  		this.info = "Invalid game code";
  	}
  	else {
  		this.info = "successful!";
  	}
  }

  validate(gamecode: string) {
  	if (!gamecode) {
  		return;
  	}
  	this.gameCodeService
  		.validate(gamecode)
			.subscribe(
				valid => this.isValid(valid),
				error => this.isValid({isFalse: 1})
				);
  }

}
