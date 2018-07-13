// Core
import { Component, OnInit } from '@angular/core';

// App specific
import { PortfolioPageService } from './portfolio-page.service';

@Component({
  selector: 'folio-portfolio',
  templateUrl: 'portfolio-page.component.html'
})
export class PortfolioPageComponent implements OnInit {
  projectsList = [];

  constructor(private portfolioService: PortfolioPageService) {
  }

  generateImage(image) {
    return 'data:image/jpeg;base64,' + image;
  }

  ngOnInit(): void {
    this.portfolioService.getProjectsList().subscribe(
      (res) => {
        this.projectsList = res.payload;
      }
      );
  }
}
