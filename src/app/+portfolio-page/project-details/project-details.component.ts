// Core
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

// App specific
import { ProjectDetailsService } from './project-details.service';


@Component({
  selector: 'folio-project-details',
  templateUrl: 'project-details.component.html'
})
export class ProjectDetailsComponent implements OnInit {
  projectSubscription: Subscription;
  projectId = '';

  projectDetails: any;
  skilsList = [];
  galleryList = [];
  activeImage: any;

  constructor(private activatedRoute: ActivatedRoute,
              private projectsService: ProjectDetailsService) {
    this.projectSubscription = this.activatedRoute.params.subscribe(params => this.projectId = params['project']);
  }

  imageSelected(index): void {
    this.activeImage = this.galleryList[index].image;
  }

  setActiveImage(image): void {
    this.activeImage = image;
  }

  previous(): void {
    console.log('prev');
  }

  next(): void {
    console.log('next');
  }

  swipe(event): void {
    switch (event) {
      case 'swiperight':
        this.next();
        break;
      case 'swipeleft':
        this.previous();
        break;
    }
  }

  ngOnInit(): void {
    this.projectsService.getProjectDetails(this.projectId).subscribe((res) => {
      if (res) {
        this.projectDetails = res.payload[0];
        this.skilsList = res.payload[0].skills;
        this.galleryList = res.payload[0].gallery;
        this.setActiveImage(res.payload[0].gallery[0].image);

      }
    });
  }
}
