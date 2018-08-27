// Core
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

// App specific
import { FaqsPageService } from './faqs-page.service';

@Component({
  selector: 'faqs-block',
  templateUrl: 'faqs-block.component.html'
})
export class FaqsBlockComponent implements OnInit {

  faqs = [];

  constructor(private faqsService: FaqsPageService,
              private location: Location) {
  }


  navigateBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.faqsService.getFaqs().subscribe((res) => {
      this.faqs = res;
    });
  }
}
