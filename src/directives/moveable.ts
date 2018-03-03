import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Storage } from '@ionic/storage';

@Directive({
  selector: '[move]'
})
export class MoveableDirective {

  @Input() drum;
  @Input() move: boolean;

  startX: number;
  startY: number;
  clientX: number;
  clientY: number;

  fingerID;

  constructor(
    public el: ElementRef,
    public storage: Storage,
    private screenOrientation: ScreenOrientation
  ) { }

  ngAfterViewInit() {
    this.storage.get("_light_"+this.drum.uniqueid).then((data) => {
      this.el.nativeElement.style.position = "relative";
      this.el.nativeElement.style.top = (data ? data.y : 0) + "px";
      this.el.nativeElement.style.left = (data ? data.x : 0) + "px";
      
      this.screenOrientation.onChange().subscribe(() => {
        this.el.nativeElement.style.top = (data ? data.y : 0) + "px";
        this.el.nativeElement.style.left = (data ? data.x : 0) + "px";
      });
    });
  }

  @HostListener('touchstart', ['$event'])
  onPanStart(event: any): void {

    if (!this.move) return;

    this.fingerID = event.targetTouches[event.targetTouches.length-1].identifier;

    event.preventDefault();
    this.clientX = this.getTouch(event.targetTouches).clientX;
    this.clientY = this.getTouch(event.targetTouches).clientY;

    let x = parseInt(this.el.nativeElement.style.left.replace("px",""));
    let y = parseInt(this.el.nativeElement.style.top.replace("px",""));

    this.startX = !isNaN(x) ? x : 0;
    this.startY = !isNaN(y) ? y : 0;
  }

  @HostListener('touchmove', ['$event'])
  onPan(event: any): void {

    if (!this.move) return;
    if (!this.getTouch(event.changedTouches)) return;

    event.preventDefault();
    let deltaX = this.getTouch(event.changedTouches).clientX - this.clientX;
    let deltaY = this.getTouch(event.changedTouches).clientY - this.clientY;
    
    this.el.nativeElement.style.top = this.startY + deltaY + "px";
    this.el.nativeElement.style.left = this.startX + deltaX + "px";
  }

  @HostListener('touchend', ['$event'])
  onMouseUp(event: any): void {

    if (!this.move) return;
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

  private getTouch(touches: TouchList): Touch {
    return Array.from(touches).find(t => t.identifier==this.fingerID);
  }

}