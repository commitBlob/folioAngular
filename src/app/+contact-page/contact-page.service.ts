// Core
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class ContactPageService {
  constructor(private http: HttpClient) {}

  public submitForm(newFormSubmission) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post('./api/notify', JSON.stringify(newFormSubmission), {headers: headers});
  }
}
