import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appSetContainerHeight]'
})
export class SetContainerHeightDirective {

  constructor(private el: ElementRef) {
    el.nativeElement.style.height = window.innerHeight + 'px';
    setTimeout(() => {
      const content = el.nativeElement.querySelector('.ant-layout-content');
      content.style.height = window.innerHeight - 140;
    }, 0);
  }

}
