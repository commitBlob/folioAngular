// Core
import { Component, OnInit } from '@angular/core';

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
    this.experienceService.getProjectsList().subscribe( (res) => {
      this.projectsList = res.payload;
    });
    this.experienceService.getPositions().subscribe( (res) => {
      this.positions = res;
      console.log('res', res);
    });
  }
}
