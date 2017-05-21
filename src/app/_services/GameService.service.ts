import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';	

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class GameService {
	private hostname = "https://damp-plains-42803.herokuapp.com/"; 

	constructor (private http: Http) {}

	saveResults(user_id, ind_investment, grp_investment, channel_id, round): Observable<object> {
		var r = round + 1;
		var url = "/api/game/" + channel_id + '/' + r;
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		let body = {
			"ind" : ind_investment,
			"grp" : grp_investment,
			"user_id" : user_id
		};
		console.log('fired');
		return this.http
			.post(this.hostname + url, body, options)
		  .map(function() {return {value:true}})
		  .catch(this.handleError);
	}

	private extractData(res: Response) {
		let body = res.json();
		return body || {};
	}

	private handleError(error: Response | any) {
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		}
		else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.log(errMsg);
		return Observable.throw(errMsg);
	}
}
