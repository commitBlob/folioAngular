// Core
import { Component, OnInit } from '@angular/core';

// App specific
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

  constructor(private skillsService: SkillsPageService) {
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
      let years = months / 12;
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
    this.skillsService.getSkillsList().subscribe((res) => {
      this.skills = res;
      this.explodeSkillsList();
    });
  }
}
