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

    // workaround to prevent animation trigger when user leaves the page
    this.faqs = [];
    this.location.back();
  }

  ngOnInit(): void {
    this.faqsService.getFaqs().subscribe((res) => {
      // don't rush
      setInterval(() => this.faqs = res, 500 );
    });
  }

}
