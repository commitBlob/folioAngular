import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'folio-project-details',
  templateUrl: 'project-details.component.html'
})
export class ProjectDetailsComponent implements OnInit {
  projectSubscription: Subscription;
  projectId = '';

  constructor(private activatedRoute: ActivatedRoute) {
    this.projectSubscription = this.activatedRoute.params.subscribe(params => this.projectId = params['project']);
  }

  ngOnInit(): void {

  }
}
