// Core
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import 'rxjs/add/observable/forkJoin';

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
  socialIcons = [];

  bouncer = '';

  constructor(private aboutMeService: AboutPageService,
              private router: Router,
              private title: Title,
              private meta: Meta) {
  }

  bounceImage(event) {
    this.bouncer = event.type === 'mouseover' ? 'bounce-out' : 'no-bounce';
  }

  generateImage(image) {
    return 'data:image/jpeg;base64,' + image;
  }

  doNavigate(route) {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    this.age = moment().diff('1992-05-11', 'years');
    Observable.forkJoin(
      this.aboutMeService.getImages(),
      this.aboutMeService.getSocialIcons()
    ).subscribe( (res) => {
      this.profilePictures = res[0];
      this.socialIcons = res[1];
      this.isLoading = false;
    });

    this.title.setTitle('Maro Radovic - Web and Software Developer | About');
    this.meta.addTag({name: 'description', content: 'About page'});
  }
}
