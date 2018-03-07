import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Lights } from '../providers/lights';


@Directive({
  selector: '[drum]'
})
export class DrumDirective {

  @Input() drum;
  @Input() move = false;
  @Input() resize = false;
  @Input() toggle = false;
  @Input() loop = false;
  @Input() lock = 0;

  fingerID;
  dragactivated = false;

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
    if (this.move || this.resize) return;

    this.fingerID = event.targetTouches[event.targetTouches.length-1].identifier;
    this.lights.toggle(this.drum);
  }

  @HostListener('touchend', ['$event'])
  onMouseUp(event: any): void {
    if (this.move || this.resize || this.toggle) return;
    this.dragactivated = false;
    this.lights.toggle(this.drum);
  }

  onTouchMove(event: any): void {
    if (this.move || this.resize || this.toggle || this.loop || this.lock > 1) return;
    if (!this.getTouch(event.changedTouches)) return;

    event.preventDefault();

    let deltaX = this.getTouch(event.changedTouches).clientX - this.getCenter().x;
    let deltaY = -(this.getTouch(event.changedTouches).clientY - this.getCenter().y);
    if (Math.abs(deltaX) > 15 || Math.abs(deltaY) > 15)
      this.dragactivated = true;

    if (!this.dragactivated) return;

    let bri = this.convertRatio(deltaY / this.getHeight(), 254);
    let hue = this.convertRatio(deltaX / this.getWidth(), 65534);

    this.lights.changeSettings(this.drum, this.lock>1 ? this.drum.bri : bri, this.lock>0 ? this.drum.hue : hue);
  }

  private showBounds() {
    this.el.nativeElement.style.outline = "1px solid rgba(255,255,255,0.25)";
    this.el.nativeElement.style.outlineOffset = (this.getWidth()*0.15) +"px";
  }

  private hideBounds() {
    this.el.nativeElement.style.outline = "none";
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

  private convertRatio(ratio: number, limit: number) {
    return Math.min(Math.max(ratio*limit +limit/2, 0), limit);
  }

  private getTouch(touches: TouchList): Touch {
    return Array.from(touches).find(t => t.identifier==this.fingerID);
  }

}