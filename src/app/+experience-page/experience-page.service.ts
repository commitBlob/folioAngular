// Core
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ExperiencePageService {
  constructor(private http: HttpClient) {}

  getProjectsList(): Observable<any> {
    return this.http.get('./api/projectslist').catch(this.handleError);
  }

  getPositions(): Observable<any> {
    return this.http.get('./api/positions').catch(this.handleError);
  }

  getEducation(): Observable<any> {
    return this.http.get('./api/education').catch(this.handleError);
  }

  /**
   * Handle HTTP error
   */
  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error('Whoops, something went wrong', errMsg);
    return Observable.throw(errMsg);
  }
}
