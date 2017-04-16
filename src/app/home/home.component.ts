import { Component, OnInit } from '@angular/core';
import { GameCodeService } from './gamecode.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [GameCodeService]
})
export class HomeComponent implements OnInit {
	
	public validated: string;
  
  constructor(private gameCodeService: GameCodeService) { }

  ngOnInit() {
  	this.validate("test-game-code");
  }

  validate(gamecode: string) {
  	this.gameCodeService.validate(gamecode)
  												.subscribe(
  													valid => this.validated = JSON.stringify(valid),
  													error => this.validated = "false"
  													);
  }

}
