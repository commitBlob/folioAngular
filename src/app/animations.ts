import {
  trigger,
  animate,
  transition,
  style,
  query,
} from '@angular/animations';

export const routerAnimation =  trigger('routerAnimation', [
  transition('* <=> *', [
    // Initial state of new route
    query(':enter',
      style({
        position: 'fixed',
        width: '100%',
        transform: 'translateX(-150%)'
      }),
      {optional: true}),

    // move page off screen right on leave
    query(':leave',
      animate('500ms ease-in',
        style({
          position: 'fixed',
          width: '100%',
          transform: 'translateX(120%)'
        })
      ),
      {optional: true, delay: 100}),

    // move page in screen from left to right
    query(':enter',
      animate('800ms ease-out',
        style({
          opacity: 1,
          transform: 'translateX(0%)'
        })
      ),
      {optional: true, delay: 200}),
  ])
]);
