// Core
import { Injectable } from '@angular/core';

// App specific
import { profile } from '../profile/profile';

@Injectable()
export class MetaTagsService {

  roleTitle = profile.roleTitle;
  name = profile.name;
  currentCompany = profile.currentCompany;

  setPageTitle(page: string): string {
    return `${this.name} - ${this.roleTitle} | ${page}`;
  }

  setDescriptionMetaTag(): any {
     // tslint:disable-next-line
    const description = `Hello, and welcome. I'm ${this.name}. Currently I work in ${this.currentCompany} as a ${this.roleTitle}. This website is an extension of my CV`;
    return {name: 'description', content: description};
  }

  setMetaTag(tagName: string, tagContent: string): any {
    return {name: tagName, content: tagContent};
  }

  setTwitterCard(): any {
    return {name: 'twitter:card', value: 'summary'};
  }

  setContentType(): any {
    return {httpEquiv: 'Content-Type', content: 'text/html', charset: 'utf-8'};
  }
}
