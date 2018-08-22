// Core
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';

// App specific
import { ExperiencePageService } from './experience-page.service';

@Component({
  selector: 'folio-xp',
  templateUrl: 'experience-page.component.html'
})
export class ExperiencePageComponent implements OnInit {

  projectsList = [];
  positions = [];

  constructor(private experienceService: ExperiencePageService) {}

  generateImage(image) {
    return 'data:image/png;base64,' + image;
  }

  generatePeriod(current: boolean, period: string) {
    return (current ? '<p>' + period + ' Present</p>' : '<p>' + period + '</p>');
  }

  ngOnInit(): void {
    Observable.forkJoin(
      this.experienceService.getProjectsList(),
      this.experienceService.getPositions()
    ).subscribe( (res) => {
      this.projectsList = res[0].payload;
      this.positions = res[1];
    });
  }
}
