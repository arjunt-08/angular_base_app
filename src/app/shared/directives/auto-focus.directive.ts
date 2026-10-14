import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
  private readonly elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.elementRef.nativeElement?.focus?.();
    }, 50);
  }
}
