// Core
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Injectable()
export class ContactPageService {
  public submitForm(_formBody: any): Observable<any> {
    return Observable.of(null);
  }
}
