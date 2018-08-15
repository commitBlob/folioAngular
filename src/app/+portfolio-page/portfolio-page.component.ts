// Core
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// App specific
import { PortfolioPageService } from './portfolio-page.service';

@Component({
  selector: 'folio-portfolio',
  templateUrl: 'portfolio-page.component.html'
})
export class PortfolioPageComponent implements OnInit {
  projectsList = [];

  constructor(private portfolioService: PortfolioPageService,
              private router: Router) {
  }

  generateImage(image) {
    return 'data:image/jpeg;base64,' + image;
  }

  goToProject(project) {
    this.router.navigate([`portfolio/${project}`]);
  }

  ngOnInit(): void {
    this.portfolioService.getProjects().subscribe(
      (res) => {
        this.projectsList = res;
      }
      );
  }
}
