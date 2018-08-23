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

  profilePictures = [];

  bouncer = '';

  constructor(private aboutMeService: AboutPageService) {
  }

  bounceImage(event) {
    this.bouncer = event.type === 'mouseover' ? 'bounce-out' : 'no-bounce';
  }

  generateImage(image) {
    return 'data:image/jpeg;base64,' + image;
  }

  ngOnInit(): void {
    this.age = moment().diff('1992-05-11', 'years');
    // FORK JOIN WHEN I CREATE CONTENT ENDPOINT
    this.aboutMeService.getImages().subscribe( (res) => {
      this.profilePictures = res;
      this.isLoading = false;
    });
  }
}
