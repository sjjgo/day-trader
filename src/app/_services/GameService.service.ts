import { throwError as observableThrowError, Observable } from "rxjs";

import { catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable()
export class GameService {
  private hostname = environment.hostname;

  constructor(private http: HttpClient) {}

  saveResults(
    user_id,
    ind_investment,
    grp_investment,
    channel_id,
    round
  ): Observable<object> {
    var r = round + 1;
    var url = "/api/game/" + channel_id + "/" + r;
    let options = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = {
      ind: ind_investment,
      grp: grp_investment,
      user_id: user_id,
    };
    // console.log('fired');
    return this.http
      .post(this.hostname + url, body, options)
      .pipe(catchError(this.handleError));
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
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
