import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Storage } from '@ionic/storage';

@Directive({
  selector: '[resize]'
})
export class ResizableDirective {

  @Input() drum;
  @Input() resize: boolean;

  fingerID;

  constructor(
    public el: ElementRef,
    private storage: Storage
  ) { }

  ngAfterViewInit() {
    this.storage.get("_light_"+this.drum.uniqueid).then((data) => {
      this.el.nativeElement.style.transform = "scale("+ (data ? data.size : 1) +")";
    });
  }

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

  @HostListener('touchend', ['$event'])
  onMouseUp(event: any): void {

    if (!this.resize) return;
    if (!this.getTouch(event.changedTouches)) return;
    event.preventDefault();

    this.storage.get("_light_"+this.drum.uniqueid).then((data: any) => {
      if (!data) data = {id: this.drum.uniqueid, x: 0, y: 0, size: 1};
      data.x = parseInt(this.el.nativeElement.style.left.replace("px","")) || data.x;
      data.y = parseInt(this.el.nativeElement.style.top.replace("px","")) || data.y;
      data.size = parseFloat(this.el.nativeElement.style.transform.replace("scale(","").replace(")","")) || data.size;
      this.storage.set("_light_"+this.drum.uniqueid, data);
    });
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