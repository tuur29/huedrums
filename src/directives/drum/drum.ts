import { Directive, ElementRef, HostListener, Input } from '@angular/core';

import { Lights } from '../../providers/lights';


@Directive({
  selector: '[drum]'
})
export class DrumDirective {

  @Input() drum;

  constructor(
    el: ElementRef,
    public lights: Lights
  ) { }

  @HostListener('mousedown') onMouseDown() {
    this.lights.flash(this.drum);
    console.log(this.drum);
  }

}