import { NavigationInteface } from './navigation.inteface';


export const GlobalNavigation: NavigationInteface[] = [
  {
    linkIcon: 'fas fa-user',
    linkName: 'ABOUT',
    linkPath: 'about'
  },
  // {
  //   linkIcon: 'fas fa-code',
  //   linkName: 'SKILLS',
  //   linkPath: 'skills'
  // },
  {
    linkIcon: 'fab fa-superpowers',
    linkName: 'SUPERPOWERS',
    linkPath: 'skills',
    linkSubName: 'SKILLS'
  },
  {
    linkIcon: 'fas fa-road',
    linkName: 'EXPERIENCE',
    linkPath: 'experience'
  },
  {
    linkIcon: 'fas fa-cubes',
    linkName: 'PORTFOLIO',
    linkPath: 'portfolio'
  },
  {
    linkIcon: 'fas fa-envelope',
    linkName: 'CONTACT',
    linkPath: 'contact'
  }
];
