import { Directive, ElementRef, HostListener, Input, EventEmitter, Output } from '@angular/core';

import { Lights } from '../providers/lights';
import { Settings } from '../providers/settings';
import { Noise } from '../providers/noise';


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
    public lights: Lights,
    public settings: Settings,
    public noise: Noise
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
      if (diff < this.settings.all.loopflashlength + 50 || diff > 2000) return;

      this.endLoop.emit();
      this.originalstate = this.drum.state.on;

      setTimeout(() => this.lights.toggle(this.drum), this.settings.all.loopflashlength);
      this.beat = setInterval(() => {
        this.lights.toggle(this.drum);
        this.noise.playBass();
        setTimeout(() => this.lights.toggle(this.drum), this.settings.all.loopflashlength);
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