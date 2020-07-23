// Core
import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

// App specific
import { MetaTagsService } from '../shared/meta-tags/meta-tags.service';
import { PortfolioPageService } from './portfolio-page.service';

@Component({
  selector: 'folio-portfolio',
  templateUrl: 'portfolio-page.component.html'
})
export class PortfolioPageComponent implements OnInit {

  pageName = 'Projects List';
  projectsList = [];

  constructor(private portfolioService: PortfolioPageService,
              private router: Router,
              private metaTagsService: MetaTagsService,
              private meta: Meta,
              private title: Title) {
  }

  generateImage(image): string {
    return 'data:image/jpeg;base64,' + image;
  }

  goToProject(project): void {
    this.router.navigate([`portfolio/${project}`]);
  }

  ngOnInit(): void {
    this.setMetaData();
    this.portfolioService.getProjects().subscribe(
      (res) => {
        this.projectsList = res;
      }
      );
  }

  setMetaData(): void {
    this.meta.addTag(this.metaTagsService.setMetaTag('description', `${this.pageName} Page`));
    this.title.setTitle(this.metaTagsService.setPageTitle(this.pageName));
    this.meta.addTag(this.metaTagsService.setContentType());
  }
}
