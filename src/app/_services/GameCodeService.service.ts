import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';	
import * as GLOBAL from '../globals';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class GameCodeService {
	private hostname = GLOBAL.hostname;
	private validationUrl = this.hostname + "/api/game-codes/validate"; 

	constructor (private http: Http) {}

	validate(gamecode: string, username: string): Observable<object> {
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		let body = {
			"gamecode" : gamecode,
			"username" : username
		};

		return this.http
			.post(this.validationUrl, body, options)
		  .map(this.extractData)
		  .catch(this.handleError);
	}

	private extractData(res: Response) {
		let body = res.json();
		return body || {isFalse : 1};
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
