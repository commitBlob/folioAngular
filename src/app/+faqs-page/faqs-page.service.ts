// Core
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class FaqsPageService {
  constructor( private http: HttpClient) {
  }

  getFaqs(): Observable<any> {
    return this.http.get('./api/faqs').catch(this.handleError);
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
