declare var Pusher:any;
import { Injectable } from '@angular/core';
import { UserService } from './UserService.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';	
import * as GLOBAL from '../globals';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class PusherService{
	private pusher;
	private channel_id;
	private channel;
	private user;
	private hostname = GLOBAL.hostname;

	constructor(private userService: UserService, private http: Http) {
		this.user = userService.getUser()
		this.pusher = new Pusher('8ec8f5164e15f7cbc5a0',{
			authEndpoint: this.hostname + '/api/pusher/auth',
			cluster: 'eu',
			auth: {
				params: {
					username : this.user.username,
					user_id: this.user.id,
					channel_id : this.user.channel_id
				}
			}
		});
	}
	public getPusher() {
		return this.pusher;
	}

	public subscribe(channel_id) {
		var channel_name = 'presence-' + channel_id;
		var socket = this.pusher;

		//	resolve means subscribed, reject means could not subscribe after x time
		return new Promise((res, rej) => {
			socket.connection.bind('connected', function () {
				this.channel = socket.subscribe(channel_name);
				res(this.channel);
			});
			socket.connection.bind('failed', function () {
				rej('Connection failed. Perhaps WebSockets is not natively supported');
			});
		});
	}

	public readyUp(user_id, channel_id): Observable<object> {
		var url = this.hostname + "/api/ready";
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		let body = {
			"user_id" : user_id,	
			"channel_id" : channel_id
		};
		return this.http.post(url, body, options)
							.map(function() {return {value: true}})
							.catch(this.handleError);

	}

	public getReadiedPlayerIds(channel_id): Observable<object> {
		var url = this.hostname +  "/api/ready/" + channel_id;
		let headers = new Headers({ 'Content-Type': 'application/json' });
		let options = new RequestOptions({ headers: headers });
		return this.http.get(url)
							.map(this.extractData)
							.catch(this.handleError);
	}	

	public getChannel() { return this.channel; }

	private extractData(res: Response) {
		let body = res.json();
		return body || { users: []};
	}


	private handleError (error: Response | any) {
	   // In a real world app, you might use a remote logging infrastructure
	   let errMsg: string;
	   if (error instanceof Response) {
	     const body = error.json() || '';
	     const err = body.error || JSON.stringify(body);
	     errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
	   } else {
	     errMsg = error.message ? error.message : error.toString();
	   }
	   console.error(errMsg);
	   return Observable.throw(errMsg);
	 }
}