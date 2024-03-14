import { trigger, transition, style, animate } from '@angular/animations';

export const slideAnimation = trigger('slideAnimation', [
  transition(':enter', [
    style({ transform: 'rotateY(-180deg)', opacity: 0 }),
    animate('500ms ease-in', style({ transform: 'rotateY(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate(
      '500ms ease-out',
      style({ transform: 'rotateY(180deg)', opacity: 0 })
    ),
  ]),
]);
