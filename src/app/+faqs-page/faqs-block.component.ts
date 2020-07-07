// Core
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

// App specific
import { FaqsPageService } from './faqs-page.service';
import { MetaTagsService } from '../shared/meta-tags/meta-tags.service';

@Component({
  selector: 'faqs-block',
  templateUrl: 'faqs-block.component.html'
})
export class FaqsBlockComponent implements OnInit {

  pageName = 'FAQs';
  faqs = [];

  constructor(private faqsService: FaqsPageService,
              private location: Location,
              private metaTagsService: MetaTagsService,
              private meta: Meta,
              private title: Title) {
  }

  navigateBack(): void {
    // workaround to prevent animation trigger when user leaves the page
    this.faqs = [];
    this.location.back();
  }

  ngOnInit(): void {
    this.setMetaData();
    this.faqsService.getFaqs().subscribe((res) => {
      // don't rush
      setInterval(() => this.faqs = res, 500 );
    });
  }

  setMetaData(): void {
    this.meta.addTag(this.metaTagsService.setMetaTag('description', `${this.pageName} Page`));
    this.title.setTitle(this.metaTagsService.setPageTitle(this.pageName));
  }

}
