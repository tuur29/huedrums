import { Directive, ElementRef, HostListener, Input, EventEmitter, Output } from '@angular/core';

import { Lights } from '../providers/lights';
import { Settings } from '../providers/settings';


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
    public settings: Settings
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
        this.highlight(true);
        setTimeout(() => {
          this.lights.toggle(this.drum);
          this.highlight(false);
        }, this.settings.all.loopflashlength);
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
    setTimeout(() => {
      this.lights.toggle(this.drum, this.originalstate);
      this.highlight(false);
    }, 50);
  }

  private getTouch(touches: TouchList): Touch {
    return Array.from(touches).find(t => t.identifier==this.fingerID);
  }

  private highlight(state = null) {
    if (!this.settings.all.highlightontap) return;

    if (state == true) {
      // turn on
      let color = "hsl(0deg,0%,65%)";
      if (this.lights.canDisplayColor(this.drum))
        color = "hsl("+ (360*this.drum.state.hue/65534) +"deg, 100%, 50%)";

      this.el.nativeElement.style.borderColor = color;
      this.el.nativeElement.style.color = color;
    } else {
      // turn off
      this.el.nativeElement.style.borderColor = "";
      this.el.nativeElement.style.color = "";
    }
  }

}