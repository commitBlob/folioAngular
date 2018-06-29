// Core
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ContactPageService {
  constructor(private http: HttpClient) {}

  public submitForm(newFormSubmission) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post('./endpoint/pat/here', JSON.stringify(newFormSubmission), {headers: headers});
  }

  /**
   * Handle HTTP error
   */
  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error('Whoops, something went wrong', errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
