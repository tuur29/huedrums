import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Lights } from '../providers/lights';


@Directive({
  selector: '[drum]'
})
export class DrumDirective {

  @Input() drum;
  @Input() move = false;
  @Input() toggle = false;
  @Input() lock = false;

  fingerID;

  constructor(
    public el: ElementRef,
    public lights: Lights
  ) { }

  ngAfterViewInit() {  
    Observable.fromEvent(this.el.nativeElement, 'touchmove')
      .throttleTime(500)
      .subscribe((event) => {
        this.onTouchMove(event);
      });
  }

  @HostListener('touchstart', ['$event'])
  onMouseDown(event: any): void {
    if (this.move) return;

    this.fingerID = event.targetTouches[event.targetTouches.length-1].identifier;
    this.lights.toggle(this.drum);
  }

  @HostListener('touchend', ['$event'])
  onMouseUp(event: any): void {
    if (this.move) return;
    if (this.toggle) return;

    this.lights.toggle(this.drum);
    this.hideBounds();
  }

  onTouchMove(event: any): void {
    if (this.move) return;
    if (this.lock) return;
    if (!this.getTouch(event.changedTouches)) return;

    event.preventDefault();

    this.showBounds();

    let deltaX = this.getTouch(event.changedTouches).clientX - this.getCenter().x;
    let deltaY = -(this.getTouch(event.changedTouches).clientY - this.getCenter().y);
    if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) return;

    let bri = this.convertRatio(deltaY*0.8 / this.el.nativeElement.offsetHeight, 254);
    let hue = this.convertRatio(deltaX*0.8 / this.el.nativeElement.offsetWidth, 65534);

    this.lights.changeSettings(this.drum, bri, hue);
  }

  private showBounds() {
    this.el.nativeElement.style.outline = "1px solid rgba(255,255,255,0.25)";
    this.el.nativeElement.style.outlineOffset = (this.el.nativeElement.offsetWidth*0.15) +"px";
  }

  private hideBounds() {
    this.el.nativeElement.style.outline = "none";
  }

  private getCenter() {
    return {
      x: this.el.nativeElement.offsetWidth / 2 + this.el.nativeElement.offsetLeft,
      y: this.el.nativeElement.offsetHeight / 2 + this.el.nativeElement.offsetTop
    }
  }

  private convertRatio(ratio: number, limit: number) {
    return Math.min(Math.max(ratio*limit +limit/2, 0), limit);
  }

  private getTouch(touches: TouchList): Touch {
    return Array.from(touches).find(t => t.identifier==this.fingerID);
  }

}