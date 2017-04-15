import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

	round = "1";
	balance = 40;

  constructor() { }

  ngOnInit() {
  }

}
