// Core
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'career-timeline',
  templateUrl: 'career-timeline.component.html'
})
export class CareerTimelineComponent {

  @Input()
  roles = [];

  @Input()
  currentCompanyLink = '';

  @Output()
  engagementSelected = new EventEmitter<string>();

  isCurrentCard(role): boolean {
    return role.engagements.some((eng) => eng.companyLink === this.currentCompanyLink);
  }

  selectEngagement(companyLink: string) {
    this.engagementSelected.emit(companyLink);
  }
}
