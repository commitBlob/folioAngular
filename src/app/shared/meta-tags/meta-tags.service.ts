// Core
import { Injectable } from '@angular/core';

@Injectable()
export class MetaTagsService {

  private roleTitle = 'Senior Software Developer & Research Lead';
  private name = 'Maro Radovic';

  setPageTitle(page: string): string {
    return `${this.name} - ${this.roleTitle} | ${page}`;
  }

  setMetaTag(tagName: string, tagContent: string): any {
    return {name: tagName, content: tagContent};
  }
}
