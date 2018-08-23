// Core
import { Component, OnInit } from '@angular/core';

// App specific
import { AboutPageService } from './about-page.service';

// Moment
import * as moment from 'moment/moment';

@Component({
  selector: 'folio-about',
  templateUrl: 'about-page.component.html'
})
export class AboutPageComponent implements OnInit {
  age: number;
  isLoading = true;

  constructor(private aboutMeService: AboutPageService) {
  }

  ngOnInit(): void {
    this.age = moment().diff('1992-05-11', 'years');
  }
}
