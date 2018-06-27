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
        transform: 'translateX(-100%)'
      }),
      {optional: true, delay: 200}),

    // move page off screen right on leave
    query(':leave',
      animate('500ms ease',
        style({
          position: 'fixed',
          width: '100%',
          transform: 'translateX(100%)'
        })
      ),
      {optional: true}),

    // move page in screen from left to right
    query(':enter',
      animate('500ms ease',
        style({
          opacity: 1,
          transform: 'translateX(0%)'
        })
      ),
      {optional: true}),
  ])
]);
