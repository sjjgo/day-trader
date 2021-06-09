import { throwError as observableThrowError, Observable } from "rxjs";

import { catchError } from "rxjs/operators";
declare var Pusher: any;
import { Injectable } from "@angular/core";
import { UserService } from "./UserService.service";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class PusherService {
  private pusher;
  private channel_id;
  private channel;
  private user;
  private hostname = environment.hostname;

  constructor(private userService: UserService, private http: HttpClient) {
    this.user = userService.getUser();
    this.pusher = new Pusher(environment.pusher_app_key, {
      authEndpoint: this.hostname + "/api/pusher/auth",
      cluster: "eu",
      auth: {
        params: {
          username: this.user.username,
          user_id: this.user.id,
          channel_id: this.user.channel_id,
        },
      },
    });
  }

  public getPusher() {
    return this.pusher;
  }

  public subscribe(channel_id) {
    var channel_name = "presence-" + channel_id;
    var socket = this.pusher;

    //	resolve means subscribed, reject means could not subscribe after x time
    return new Promise((res, rej) => {
      socket.connection.bind("connected", function () {
        this.channel = socket.subscribe(channel_name);
        res(this.channel);
      });
      socket.connection.bind("failed", function () {
        rej("Connection failed. Perhaps WebSockets is not natively supported");
      });
    });
  }

  public readyUp(user_id, channel_id): Observable<object> {
    var url = this.hostname + "/api/ready";
    let options = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = {
      user_id: user_id,
      channel_id: channel_id,
    };
    return this.http
      .post(url, body, options)
      .pipe(catchError(this.handleError));
  }

  public getReadiedPlayerIds(channel_id): Observable<object> {
    var url = this.hostname + "/api/ready/" + channel_id;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  public getChannel() {
    return this.channel;
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { users: [] };
  }

  private handleError(error: HttpErrorResponse | any) {
    let errMsg: string;
    if (error instanceof HttpErrorResponse) {
      errMsg = error.name + " " + error.message + " " + error.error;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.log(errMsg);
    return observableThrowError(errMsg);
  }
}
