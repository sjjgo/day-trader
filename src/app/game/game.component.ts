import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

	table = [
		{
			player : 1,
			indInv: 20,
			grpInv: 20, 
			indPayoff: 40,
			grpPayoff: 80,
			profit: 80,
			total: 120
		}
	];

	public indInv: number;
	public grpInv: number;
	public disabled : boolean = false;
	public error: string = "";
	public round = "1";
	public balance = 40;

  constructor() { }

  validate(value: string, box: number){
  	var result = this.validateValue(value);
  	this.error = result.res;
  	console.log(result.res);
  	switch (box) {
  		case 1:
  			// code...
  			break;
  		case 2:
  			//
  			break; 
  		default:
  			// code...
  			break;
  	}
  }

  validateValue(value: string) {
  	let result = {
  		valid: false, 
  		res: ""
  	};
  	console.log(Number(value));
  	if (isNaN(Number(value))) {
  		result.res = "Not a number";
  	}
  	else {
  		result.valid =true;
  	}
  	return result;
  }

  ngOnInit() {
  }

}
