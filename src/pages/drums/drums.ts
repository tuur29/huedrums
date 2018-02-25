import { Component, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Lights } from '../../providers/lights';


@Component({
  selector: 'page-drums',
  templateUrl: 'drums.html'
})
export class DrumsPage {

  drums: any;
  moveDrums: boolean = false;
  resizeDrums: boolean = false;
  toggleOnStates: boolean = false;
  lockSettings: boolean = false;

  strobeLoop;
  strobecolor: number = 0;

  constructor(
    public el: ElementRef,
  	public navCtrl: NavController,
  	public lights: Lights
  ) {

  	this.lights.onReady().then(() => {
      this.drums = this.lights.query();
      console.log(this.drums);
    });

  }

  openSettings() {
    this.navCtrl.push('SettingsPage', {
      callback: (val) => {
        if (val)
          this.refresh()
      }
    });
  }

  refresh() {
    this.lights.refresh().then(() => {
      this.moveDrums = false;
      this.resizeDrums = false;
      this.toggleOnStates = false;
      this.lockSettings = false;
      this.drums = this.lights.query();
      console.log(this.drums);
    });
  }

  strobe(event) {
    if (this.moveDrums || this.resizeDrums || this.toggleOnStates) return;
    if (event.target.classList.contains("list")) {
      if (!this.lockSettings)
        this.strobecolor = 0;
      let count = 1;
      clearInterval(this.strobeLoop);
      event.target.style.background = this.getStrobeColor();
      this.strobeLoop = setInterval(() => {
        event.target.style.background = count%2 ? this.getStrobeColor() : "unset";
        count++;
      }, 50);
    }
  }

  editStrobe(event) {
    if (this.moveDrums || this.resizeDrums || this.toggleOnStates || this.lockSettings) return;
    let percent = Math.round(360*event.changedTouches[0].clientX / this.el.nativeElement.offsetWidth);
    setTimeout(() => {
      this.strobecolor = Math.max(0, Math.min(360, percent));
    }, 5);
  }

  endStrobe(event) {
    if (this.moveDrums || this.resizeDrums || this.toggleOnStates) return;
    if (event.target.classList.contains("list")) {
      clearInterval(this.strobeLoop);
      event.target.style.background = "unset";
    }
  }

  moveDrumsToggle() {
    this.moveDrums = !this.moveDrums;
    this.resizeDrums = false;
    this.toggleOnStates = false;
    this.lockSettings = false;
  }

  resizeDrumsToggle() {
    this.resizeDrums = !this.resizeDrums;
    this.moveDrums = false;
    this.toggleOnStates = false;
    this.lockSettings = false;
  }

  toggleOnStatesToggle() {
    this.toggleOnStates = !this.toggleOnStates;
    this.moveDrums = false;
    this.resizeDrums = false;
    this.lockSettings = false;
  }

  lockSettingsToggle() {
    this.lockSettings = !this.lockSettings;
    this.moveDrums = false;
    this.resizeDrums = false;
    this.toggleOnStates = false;
  }

  private getStrobeColor() {
    return "hsl("+ this.strobecolor +",100%, "+(this.strobecolor?"50":"100")+"%)";
  }

}
