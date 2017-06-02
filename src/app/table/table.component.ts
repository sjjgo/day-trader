import { Component, Input  } from '@angular/core';
import { ParamsService } from '../_services/ParamsService.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent{
	public currentTable = 4;
	@Input() tables;
  constructor() {}
  
  public switchTable(i) {
  	this.currentTable = i;
  }

}
