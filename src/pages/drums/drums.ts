import { Component, ElementRef } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';

import { Lights } from '../../providers/lights';
import { Settings } from '../../providers/settings';


@IonicPage()
@Component({
  selector: 'page-drums',
  templateUrl: 'drums.html'
})
export class DrumsPage {

  drums: any;
  moveDrums: boolean = false;
  resizeDrums: boolean = false;
  toggleOnStates: boolean = false;
  toggleLoopMode: boolean = false;
  lockSettings: boolean = false;

  strobeLoop;
  strobecolor: number = 0;

  constructor(
    public fullscreen: AndroidFullScreen,
    public el: ElementRef,
    public navCtrl: NavController,
    public lights: Lights,
  	public settings: Settings,
  ) {

    this.settings.load();

    this.lights.onReady().then(() => {
      this.drums = this.lights.query();
      console.log(this.drums);
    });

  }

  ionViewWillEnter() {
    this.fullscreen.immersiveMode();
  }

  ionViewWillLeave() {
    this.fullscreen.showSystemUI();
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
      this.toggleLoopMode = false;
      this.lockSettings = false;
      this.drums = this.lights.query();
      console.log(this.drums);
    });
  }

  strobe(event) {
    if (!this.settings.all.enablestrobing || this.moveDrums || this.resizeDrums || this.toggleOnStates || this.toggleLoopMode)  return;
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
    if (this.moveDrums || this.resizeDrums || this.toggleOnStates || this.toggleLoopMode || this.lockSettings) return;
    if (event.target.classList.contains("list")) {
      let percent = Math.round(360*event.changedTouches[0].clientX / this.el.nativeElement.offsetWidth);
      setTimeout(() => {
        this.strobecolor = Math.max(0, Math.min(360, percent));
      }, 5);
    }
  }

  endStrobe(event) {
    if (this.moveDrums || this.resizeDrums || this.toggleOnStates || this.toggleLoopMode) return;
    if (event.target.classList.contains("list")) {
      clearInterval(this.strobeLoop);
      event.target.style.background = "unset";
    }
  }

  moveDrumsToggle() {
    this.moveDrums = !this.moveDrums;
    this.resizeDrums = false;
    this.toggleOnStates = false;
    this.toggleLoopMode = false;
    this.lockSettings = false;
  }

  resizeDrumsToggle() {
    this.resizeDrums = !this.resizeDrums;
    this.moveDrums = false;
    this.toggleOnStates = false;
    this.toggleLoopMode = false;
    this.lockSettings = false;
  }

  toggleOnStatesToggle() {
    this.toggleOnStates = !this.toggleOnStates;
    this.moveDrums = false;
    this.resizeDrums = false;
    this.toggleLoopMode = false;
    this.lockSettings = false;
  }

  toggleLoopModeToggle() {
    this.toggleLoopMode = !this.toggleLoopMode;
    this.moveDrums = false;
    this.resizeDrums = false;
    this.toggleOnStates = false;
    this.lockSettings = false;
  }

  lockSettingsToggle() {
    this.lockSettings = !this.lockSettings;
    this.moveDrums = false;
    this.resizeDrums = false;
    this.toggleOnStates = false;
    this.toggleLoopMode = false;
  }

  private getStrobeColor() {
    return "hsl("+ this.strobecolor +",100%, "+(this.strobecolor?"50":"100")+"%)";
  }

}
