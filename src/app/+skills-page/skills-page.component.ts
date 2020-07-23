// Core
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

// App specific
import { MetaTagsService } from '../shared/meta-tags/meta-tags.service';
import { SkillsPageService } from './skills-page.service';
import { SkillsInterface } from './skills.interface';

// Moment
import * as moment from 'moment/moment';

@Component({
  selector: 'folio-skills',
  templateUrl: 'skills-page.component.html'
})
export class SkillsPageComponent implements OnInit {

  skills: SkillsInterface[] = [];
  fontAwesomeList: SkillsInterface[] = [];
  customIconsList: SkillsInterface[] = [];
  skillsContent: any;
  pageName = 'Skills';

  constructor(private skillsService: SkillsPageService,
              private metaTagsService: MetaTagsService,
              private title: Title,
              private meta: Meta) {
  }

  explodeSkillsList() {
    this.skills.forEach((value) => {
      value['font-awesome'] ? this.fontAwesomeList.push(value) : this.customIconsList.push(value);
    });
  }

  convertMonths(months) {
    if (months < 12) {
      return months + ' m';
    } else {
      // round to one decimal
      let years = Math.round((months / 12) * 10) / 10;
      return years + ' y';
    }
  }

  calculateExperience(startDate) {
    let momentObj = moment(startDate, 'DD-MM-YYYY');
    let duration = moment().diff(momentObj, 'months');
    if (duration < 12) {
      return duration + ' m';
    } else {
      let years = Math.round(duration / 12);
      return years + ' y';
    }
  }

  ngOnInit(): void {
    this.setMetaData();
    this.skillsService.getSkillsList().subscribe((res) => {
      this.skills = res;
      this.explodeSkillsList();
    });
    this.skillsService.getSkillsContent().subscribe((res) => {
      this.skillsContent = res[0];
    });
  }

  setMetaData(): void {
    this.meta.addTag(this.metaTagsService.setMetaTag('description', `${this.pageName} Page`));
    this.title.setTitle(this.metaTagsService.setPageTitle(this.pageName));
    this.meta.addTag(this.metaTagsService.setContentType());
  }
}
