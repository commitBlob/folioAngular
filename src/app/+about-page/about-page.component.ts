// Core
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import 'rxjs/add/observable/forkJoin';

// App specific
import { AboutPageService } from './about-page.service';
import { MetaTagsService } from '../shared/meta-tags/meta-tags.service';

// Moment
import * as moment from 'moment/moment';

@Component({
  selector: 'folio-about',
  templateUrl: 'about-page.component.html'
})
export class AboutPageComponent implements OnInit {
  age: number;
  isLoading = true;
  pageName = 'About';

  profilePictures = [];
  socialIcons = [];

  bouncer = '';

  constructor(private aboutMeService: AboutPageService,
              private router: Router,
              private title: Title,
              private meta: Meta,
              private metaTagsService: MetaTagsService) {
  }

  bounceImage(event): void {
    this.bouncer = event.type === 'mouseover' ? 'bounce-out' : 'no-bounce';
  }

  generateImage(image): string {
    return 'data:image/jpeg;base64,' + image;
  }

  doNavigate(route): void {
    this.router.navigate([route]);
  }

  ngOnInit(): void {
    this.setMetaData();
    this.calculateAge();
    Observable.forkJoin(
      this.aboutMeService.getImages(),
      this.aboutMeService.getSocialIcons()
    ).subscribe( (res) => {
      this.profilePictures = res[0];
      this.socialIcons = res[1];
      this.isLoading = false;
    });
  }

  setMetaData(): void {
    this.meta.addTag(this.metaTagsService.setDescriptionMetaTag());
    this.title.setTitle(this.metaTagsService.setPageTitle(this.pageName));
    this.meta.addTag(this.metaTagsService.setContentType());
    this.meta.addTag(this.metaTagsService.setTwitterCard());
    this.setOpenGraphMetaData();
    this.setTwitterMetaData();
  }

  setOpenGraphMetaData(): void {
    this.meta.addTag(this.metaTagsService.setMetaTag('og:title', this.metaTagsService.setPageTitle(this.pageName)));
    this.meta.addTag(this.metaTagsService.setMetaTag('og:type', 'website'));
    this.meta.addTag(this.metaTagsService.setMetaTag('og:url', 'http://maro.guru'));
    this.meta.addTag(this.metaTagsService.setMetaTag('og:image', `http://maro.guru/assets/maro.png`));
    this.meta.addTag(this.metaTagsService.setMetaTag('og:description', this.metaTagsService.setDescriptionMetaTag().content));
  }

  setTwitterMetaData(): void {
    this.meta.addTags([
      this.metaTagsService.setMetaTag('twitter:card', 'summary_large_image'),
      this.metaTagsService.setMetaTag('twitter:url', 'http://maro.guru'),
      this.metaTagsService.setMetaTag('twitter:title', this.metaTagsService.setPageTitle(this.pageName)),
      this.metaTagsService.setMetaTag('twitter:description', this.metaTagsService.setDescriptionMetaTag().content),
      this.metaTagsService.setMetaTag('twitter:image', 'http://maro.guru/assets/maro.png')
    ]);
  }

  calculateAge(): void {
    this.age = moment().diff('1992-05-11', 'years');
  }

}
