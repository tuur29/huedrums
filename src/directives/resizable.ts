import { Directive, ElementRef, HostListener, Input } from '@angular/core';


@Directive({
  selector: '[resize]'
})
export class ResizableDirective {

  @Input() resize: boolean;

  fingerID;

  constructor(
    public el: ElementRef
  ) { }

  @HostListener('touchstart', ['$event'])
  onPanStart(event: any): void {

    if (!this.resize) return;
    event.preventDefault();

    this.fingerID = event.targetTouches[event.targetTouches.length-1].identifier;
  }

  @HostListener('touchmove', ['$event'])
  onPan(event: any): void {

    if (!this.resize) return;
    if (!this.getTouch(event.changedTouches)) return;

    event.preventDefault();
    let deltaY = -(this.getTouch(event.changedTouches).clientY - this.getCenter().y);

    let scale = Math.min(1, Math.max(-0.35, deltaY / this.getHeight() )) +1;
    this.el.nativeElement.style.transform = "scale("+ scale +")";
  }

  private getCenter() {
    return {
      x: this.getWidth() / 2 + this.getLeft(),
      y: this.getHeight() / 2 + this.getTop()
    }
  }

  private getLeft() {
    return this.el.nativeElement.getBoundingClientRect().x;
  }

  private getTop() {
    return this.el.nativeElement.getBoundingClientRect().y;
  }

  private getWidth() {
    return this.el.nativeElement.getBoundingClientRect().width;
  }

  private getHeight() {
    return this.el.nativeElement.getBoundingClientRect().width;
  }

  private getTouch(touches: TouchList): Touch {
    return Array.from(touches).find(t => t.identifier==this.fingerID);
  }

}