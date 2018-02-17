import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';


@Directive({
  selector: '[move]'
})
export class MoveableDirective {

  @Input() move: boolean;

  startX: number;
  startY: number;
  clientX: number;
  clientY: number;

  constructor(
    public el: ElementRef,
    private screenOrientation: ScreenOrientation
  ) {
    this.el.nativeElement.style.position = "relative";
    this.el.nativeElement.style.top = 0;
    this.el.nativeElement.style.left = 0;

    this.screenOrientation.onChange().subscribe(() => {
      this.el.nativeElement.style.top = 0;
      this.el.nativeElement.style.left = 0;
    });
  }

  @HostListener('touchstart', ['$event'])
  onPanStart(event: any): void {

    if (!this.move) return;

    event.preventDefault();
    this.clientX = event.touches[0].clientX;
    this.clientY = event.touches[0].clientY;

    let x = parseInt(this.el.nativeElement.style.left.replace("px",""));
    let y = parseInt(this.el.nativeElement.style.top.replace("px",""));

    this.startX = !isNaN(x) ? x : 0;
    this.startY = !isNaN(y) ? y : 0;
  }

  @HostListener('touchmove', ['$event'])
  onPan(event: any): void {

    if (!this.move) return;

    event.preventDefault();
    let deltaX = event.changedTouches[0].clientX - this.clientX;
    let deltaY = event.changedTouches[0].clientY - this.clientY;
    
    this.el.nativeElement.style.top = this.startY + deltaY + "px";
    this.el.nativeElement.style.left = this.startX + deltaX + "px";
  }

}