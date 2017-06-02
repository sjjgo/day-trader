import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { UserService } from './_services/UserService.service';
import { PusherService } from './_services/PusherService.service';
import { ParamsService } from './_services/ParamsService.service';

import { APP_ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { ResultComponent } from './result/result.component';
import { InstructionComponent } from './instruction/instruction.component';
import { ReadyComponent } from './ready/ready.component';
import { EndComponent } from './end/end.component';
import { TableComponent } from './table/table.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    GameComponent,
    ResultComponent,
    InstructionComponent,
    ReadyComponent,
    EndComponent,
    TableComponent,
  ],
  exports: [],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [UserService, PusherService, ParamsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
