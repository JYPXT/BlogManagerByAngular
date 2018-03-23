import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appSetContainerHeight]'
})
export class SetContainerHeightDirective {

  // @Input() highlightColor: string;
  constructor(private el: ElementRef) {
    el.nativeElement.style.height = window.innerHeight + 'px';
    setTimeout(() => {
      const content = el.nativeElement.querySelector('.ant-layout-content');
      content.style.height = window.innerHeight - 140;
    }, 0);
  }

  // @HostListener('mouseenter') onMouseEnter() {
  // }

}

// 当然，你可以通过标准的 JavaScript 方式手动给宿主 DOM 元素附加一个事件监听器。 但这种方法至少有三个问题：
// 必须正确的书写事件监听器。
// 当指令被销毁的时候，必须拆卸事件监听器，否则会导致内存泄露。
// 必须直接和 DOM API 打交道，应该避免这样做
