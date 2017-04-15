import { HomeComponent } from './home/home.component';
import { GameComponent } from './game/game.component';
import { ResultComponent } from './result/result.component';
import { EndComponent } from './end/end.component';
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
	{path: '', component: HomeComponent},
	{path: 'home', component: HomeComponent},
	{path: 'game', component: GameComponent},
	{path: 'result', component: ResultComponent},
	{path: 'end', component: EndComponent}

];