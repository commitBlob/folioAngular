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
        transform: 'translateX(-200%)'
      }),
      {optional: true}),

    // move page off screen right on leave
    query(':leave',
      animate('800ms ease-in',
        style({
          position: 'fixed',
          width: '100%',
          transform: 'translateX(100%)'
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
