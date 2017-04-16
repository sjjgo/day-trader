import { Component, OnInit } from '@angular/core';
import { GameCodeService } from './home.service';

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
  	this.validated = this.gameCodeService.validate();
  }

}
