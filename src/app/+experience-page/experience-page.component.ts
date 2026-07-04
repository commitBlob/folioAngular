// Core
import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
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
  careerProgression = null;
  highlightedCompanyLink = '';

  @ViewChildren('positionCard') positionCards: QueryList<ElementRef>;

  private highlightTimer: any;

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

  showTimeline(companyLink: string): boolean {
    return !!this.careerProgression && this.careerProgression.roles
      .some((role) => role.engagements.some((eng) => eng.companyLink === companyLink));
  }

  scrollToPosition(companyLink: string): void {
    const card = this.positionCards.find(
      (el) => el.nativeElement.getAttribute('data-company-link') === companyLink);
    if (!card) {
      return;
    }
    card.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.highlightedCompanyLink = companyLink;
    clearTimeout(this.highlightTimer);
    this.highlightTimer = setTimeout(() => this.highlightedCompanyLink = '', 2000);
  }

  ngOnInit(): void {
    this.setMetaData();
    Observable.forkJoin(
      this.experienceService.getProjectsList(),
      this.experienceService.getPositions(),
      this.experienceService.getEducation(),
      this.experienceService.getCareerProgression()
    ).subscribe( (res) => {
      this.projectsList = res[0].payload;
      this.positions = res[1];
      this.education = res[2];
      this.careerProgression = res[3];
    });
  }

  setMetaData(): void {
    this.meta.addTag(this.metaTagsService.setMetaTag('description', `${this.pageName} Page`));
    this.title.setTitle(this.metaTagsService.setPageTitle(this.pageName));
    this.meta.addTag(this.metaTagsService.setContentType());
  }
}
