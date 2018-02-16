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

  clientX: number;
  clientY: number;

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

    event.preventDefault();

    this.clientX = event.touches[0].clientX;
    this.clientY = event.touches[0].clientY;
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

    event.preventDefault();

    let deltaX = event.changedTouches[0].clientX - this.clientX;
    let deltaY = event.changedTouches[0].clientY - this.clientY;
    if (Math.abs(deltaX) < 5 && Math.abs(deltaY) < 5) return;

    let bri = this.convertRatio((-deltaY*0.7) / this.height, 254);
    let hue = this.convertRatio(deltaX*0.8 / this.width, 65534);

    this.lights.changeSettings(this.drum, bri, hue);
  }

  private convertRatio(ratio: number, limit: number) {
    return Math.min(Math.max(ratio*limit +limit/2, 0), limit);
  }

}