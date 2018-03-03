import { Directive, ElementRef, HostListener, Input, EventEmitter, Output } from '@angular/core';

import { Lights } from '../providers/lights';


@Directive({
  selector: '[loop]'
})
export class LoopableDirective {

  @Input() drum;
  @Input() loop;
  @Output() endLoop = new EventEmitter<any>();

  lastTap = 0;
  beat = null;
  originalstate = null;
  fingerID;

  constructor(
    public el: ElementRef,
    public lights: Lights
  ) { }

  @HostListener('touchstart', ['$event'])
  onMouseDown(event: any): void {

    if (!this.loop) return;
    event.preventDefault();
    this.fingerID = event.targetTouches[event.targetTouches.length-1].identifier;

    if (!this.lastTap) {
      this.lastTap = (new Date()).getTime();
    } else {
      let diff = (new Date()).getTime() - this.lastTap;
      this.lastTap = 0;
      if (diff < 200 || diff > 1500) return;

      this.endLoop.emit();
      this.originalstate = this.drum.state.on;

      setTimeout(() => this.lights.toggle(this.drum), 150);
      this.beat = setInterval(() => {
        this.lights.toggle(this.drum);
        setTimeout(() => this.lights.toggle(this.drum), 150);
      }, diff);
    }

  }

  @HostListener('touchend', ['$event'])
  onMouseUp(event: any): void {
    if (!this.beat) return;
    if (!this.getTouch(event.changedTouches)) return;
    
    clearInterval(this.beat);
    this.beat = null;
    this.originalstate = null;
    setTimeout(() => this.lights.toggle(this.drum, this.originalstate), 50);
  }

  private getTouch(touches: TouchList): Touch {
    return Array.from(touches).find(t => t.identifier==this.fingerID);
  }

}