// Core
import { Component, Input, OnInit } from '@angular/core';

// App specific
import { NavigationInteface } from './navigation.inteface';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'folio-navigation',
  templateUrl: 'navigation.component.html'
})
export class NavigationComponent implements OnInit {
  @Input() menuOpen;

  navigationElements: NavigationInteface[] = [];

  constructor(private navigationService: NavigationService) {}

  ngOnInit(): void {
    this.navigationElements = this.navigationService.getNavigation();
  }
}

