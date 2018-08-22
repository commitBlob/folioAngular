import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'position-projects',
  templateUrl: 'experience-projects.component.html'
})
export class ExperienceProjectsComponent implements OnInit {

  @Input()
  companyShortName = '';

  @Input()
  projectsList = [];

  filteredProjects = [];

  projectsFiltered = false;

  constructor(private router: Router) {}

  filterProjects() {
    // reset
    this.filteredProjects = [];
    this.projectsFiltered = false;
    this.projectsList.forEach((value) => {
      if (value.companyLink === this.companyShortName) {
        this.filteredProjects.push(value);
      }
    });
    this.projectsFiltered = true;
  }

  goToProject(projectId) {
    this.router.navigate(['/portfolio/' + projectId]);
  }

  ngOnInit(): void {
    this.filterProjects();
  }
}
