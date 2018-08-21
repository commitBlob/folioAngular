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

  constructor(private experienceService: ExperiencePageService) {}

  ngOnInit(): void {
    this.experienceService.getProjectsList().subscribe( (res) => {
      this.projectsList = res.payload;
      console.log('response ', res.payload);
    });
  }
}
