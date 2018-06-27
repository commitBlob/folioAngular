// Core
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// App specific
import { NavigationInteface } from './navigation.inteface';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'folio-navigation',
  templateUrl: 'navigation.component.html'
})
export class NavigationComponent implements OnInit {
  @Input() menuOpen;

  @Output()
  menuStateUpdated = new EventEmitter<any>();

  navigationElements: NavigationInteface[] = [];

  constructor(private navigationService: NavigationService) {}


  menuSelected() {
    let menuState = !this.menuOpen;
    this.menuStateUpdated.emit(menuState);
  }

  ngOnInit(): void {
    this.navigationElements = this.navigationService.getNavigation();
  }
}

