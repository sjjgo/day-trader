import { Component, OnInit } from "@angular/core";
import { TableComponent } from "../table/table.component";
import { ParamsService } from "../_services/ParamsService.service";

@Component({
  selector: "app-end",
  templateUrl: "./end.component.html",
  styleUrls: ["./end.component.css"],
})
export class EndComponent implements OnInit {
  public tables;
  constructor(private params: ParamsService) {}

  ngOnInit() {
    this.tables = this.params.getTables();
  }
}
