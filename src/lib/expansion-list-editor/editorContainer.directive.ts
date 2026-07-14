import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[editor-container]',
  standalone: true,
})
export class EditorContainerDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}