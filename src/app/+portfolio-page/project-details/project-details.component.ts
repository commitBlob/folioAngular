// Core
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Location } from '@angular/common';

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
  fontAwesomeList = [];
  customIconsList = [];
  galleryList = [];
  activeImage: any;
  activeImageTitle: '';
  activeImageIndex: any;

  constructor(private activatedRoute: ActivatedRoute,
              private projectsService: ProjectDetailsService,
              private location: Location) {
    this.projectSubscription = this.activatedRoute.params.subscribe(params => this.projectId = params['project']);
  }

  imageSelected(index): void {
    this.activeImageIndex = index;
    this.activeImage = this.galleryList[index].image;
    this.activeImageTitle = this.galleryList[index].imageName;
  }

  setActiveImage(imageList, index): void {
    this.activeImage = imageList[index].image;
    this.activeImageTitle = imageList[index].imageName;
  }

  previous(): void {
    let imageIndex = this.activeImageIndex;
    if (imageIndex > 0) {
      imageIndex--;
      this.activeImage = this.galleryList[imageIndex].image;
      this.activeImageIndex = imageIndex;
      this.activeImageTitle = this.galleryList[imageIndex].imageName;
    } else {
      const arrayLength = this.galleryList.length;
      this.activeImage = this.galleryList[arrayLength - 1].image;
      this.activeImageIndex = arrayLength - 1;
      this.activeImageTitle = this.galleryList[arrayLength - 1].imageName;
    }
  }

  next(): void {
    let imageIndex = this.activeImageIndex;
    const arrayLength = this.galleryList.length - 1;
    if (imageIndex === arrayLength) {
      this.activeImageIndex = 0;
      this.activeImage = this.galleryList[0].image;
      this.activeImageTitle = this.galleryList[0].imageName;
    } else {
      imageIndex++;
      this.activeImage = this.galleryList[imageIndex].image;
      this.activeImageIndex = imageIndex;
      this.activeImageTitle =  this.galleryList[imageIndex].imageName;
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

  explodeSkillsList() {
    this.skillsList.forEach((value) => {
      value['font-awesome'] ? this.fontAwesomeList.push(value) : this.customIconsList.push(value);
    });
  }

  navigateBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.projectsService.getProjectDetails(this.projectId).subscribe((res) => {
      if (res) {
        this.projectDetails = res[0];
        this.skillsList = res[0].skills;
        this.galleryList = res[0].gallery;
        this.setActiveImage(res[0].gallery, 0);
        this.activeImageIndex = 0;
        this.explodeSkillsList();
      }
    });
  }
}
