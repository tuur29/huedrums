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

  clientX: number;
  clientY: number;

  fingerID;

  height: number;
  width: number;

  constructor(
    public el: ElementRef,
    public lights: Lights
  ) { }

  ngAfterViewInit() {  
    this.height = this.el.nativeElement.offsetHeight;
    this.width = this.el.nativeElement.offsetWidth;

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

    this.clientX = this.getTouch(event.targetTouches).clientX;
    this.clientY = this.getTouch(event.targetTouches).clientY;
    this.lights.toggle(this.drum);
  }

  @HostListener('touchend', ['$event'])
  onMouseUp(event: any): void {
    if (this.move) return;
    if (this.toggle) return;

    this.lights.toggle(this.drum);
  }

  onTouchMove(event: any): void {
    if (this.move) return;
    if (this.lock) return;
    if (!this.getTouch(event.changedTouches)) return;

    event.preventDefault();

    let deltaX = this.getTouch(event.changedTouches).clientX - this.clientX;
    let deltaY = this.getTouch(event.changedTouches).clientY - this.clientY;
    if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) return;

    let bri = this.convertRatio((-deltaY*0.7) / this.height, 254);
    let hue = this.convertRatio(deltaX*0.8 / this.width, 65534);

    this.lights.changeSettings(this.drum, bri, hue);
  }

  private convertRatio(ratio: number, limit: number) {
    return Math.min(Math.max(ratio*limit +limit/2, 0), limit);
  }

  private getTouch(touches: TouchList): Touch {
    return Array.from(touches).find(t => t.identifier==this.fingerID);
  }

}