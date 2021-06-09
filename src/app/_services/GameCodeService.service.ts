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
export class GameCodeService {
  private hostname = environment.hostname;
  private validationUrl = this.hostname + "/api/game-codes/validate";

  constructor(private http: HttpClient) {}

  validate(gamecode: string, username: string): Observable<object> {
    let options = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
    };
    let body = {
      gamecode: gamecode,
      username: username,
    };

    return this.http
      .post(this.validationUrl, body, options)
      .pipe(catchError(this.handleError));
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { isFalse: 1 };
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
