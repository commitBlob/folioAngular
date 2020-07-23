// Core
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

// App specific
import { ExperiencePageService } from './experience-page.service';
import { MetaTagsService } from '../shared/meta-tags/meta-tags.service';

@Component({
  selector: 'folio-xp',
  templateUrl: 'experience-page.component.html'
})
export class ExperiencePageComponent implements OnInit {

  pageName = 'Experience';
  projectsList = [];
  positions = [];
  education = [];

  constructor(private experienceService: ExperiencePageService,
              private metaTagsService: MetaTagsService,
              private meta: Meta,
              private title: Title) {}

  generateImage(image) {
    return 'data:image/png;base64,' + image;
  }

  generatePeriod(current: boolean, period: string) {
    return (current ? '<p>' + period + ' Present</p>' : '<p>' + period + '</p>');
  }

  ngOnInit(): void {
    this.setMetaData();
    Observable.forkJoin(
      this.experienceService.getProjectsList(),
      this.experienceService.getPositions(),
      this.experienceService.getEducation()
    ).subscribe( (res) => {
      this.projectsList = res[0].payload;
      this.positions = res[1];
      this.education = res[2];
    });
  }

  setMetaData(): void {
    this.meta.addTag(this.metaTagsService.setMetaTag('description', `${this.pageName} Page`));
    this.title.setTitle(this.metaTagsService.setPageTitle(this.pageName));
    this.meta.addTag(this.metaTagsService.setContentType());
  }
}
