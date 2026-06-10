// Core
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

@Injectable()
export class ProjectDetailsService {
  constructor(private http: HttpClient) {}

  getProjectDetails(projectId): Observable<any> {
    return this.http.get('./assets/data/projectdissimilar/project_details.json')
      .map((res: any[]) => res.filter(item => String(item.id) === String(projectId)))
      .catch(this.handleError);
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
