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
  skillsList = [];
  galleryList = [];
  activeImage: any;
  activeImageIndex: any;

  constructor(private activatedRoute: ActivatedRoute,
              private projectsService: ProjectDetailsService) {
    this.projectSubscription = this.activatedRoute.params.subscribe(params => this.projectId = params['project']);
  }

  imageSelected(index): void {
    this.activeImageIndex = index;
    this.activeImage = this.galleryList[index].image;
  }

  setActiveImage(imageList, index): void {
    this.activeImage = imageList[index].image;
  }

  previous(): void {
    console.log('prev');
    let imageIndex = this.activeImageIndex;
    if (imageIndex > 0) {
      imageIndex--;
      this.activeImage = this.galleryList[imageIndex].image;
      this.activeImageIndex = imageIndex;
    } else {
      const arrayLength = this.galleryList.length;
      this.activeImage = this.galleryList[arrayLength - 1].image;
      this.activeImageIndex = arrayLength - 1;
    }
  }

  next(): void {
    console.log('next');
    let imageIndex = this.activeImageIndex;
    const arrayLength = this.galleryList.length - 1;
    if (imageIndex === arrayLength) {
      this.activeImageIndex = 0;
      this.activeImage = this.galleryList[0].image;
    } else {
      imageIndex++;
      this.activeImage = this.galleryList[imageIndex].image;
      this.activeImageIndex = imageIndex;
    }
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
        this.skillsList = res.payload[0].skills;
        this.galleryList = res.payload[0].gallery;
        this.setActiveImage(res.payload[0].gallery, 0);
        this.activeImageIndex = 0;
      }
    });
  }
}
