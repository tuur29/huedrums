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
  strobeFinger: any;

  moveDrums: boolean = false;
  resizeDrums: boolean = false;
  toggleOnStates: boolean = false;
  toggleLoopMode: boolean = false;
  lockSettings: number = 0;

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
      this.lockSettings = 0;
      this.drums = this.lights.query();
      console.log(this.drums);
    });
  }

  strobe(event) {
    if (!this.settings.all.enablestrobing || this.moveDrums || this.resizeDrums || this.toggleOnStates || this.toggleLoopMode)  return;
    if (event.target.parentNode.classList.contains("list")) {
      if (this.lockSettings != 1 && this.lockSettings != 3)
        event.target.style.background = "";

      this.strobeFinger = event.targetTouches[event.targetTouches.length-1].identifier;
      event.target.style.animationDuration = this.settings.all.strobespeed+"ms";
      document.getElementById("content").className += " strobe";
    }
  }

  editStrobe(event) {
    if (!this.settings.all.enablestrobing || this.moveDrums || this.resizeDrums || this.toggleOnStates || this.toggleLoopMode || this.lockSettings == 1 || this.lockSettings == 3) return;
    if (event.target.parentNode.classList.contains("list")
      && event.targetTouches[event.targetTouches.length-1].identifier == this.strobeFinger) {
      let percent = Math.round(360*this.getStrobeTouch(event.changedTouches).clientX / this.el.nativeElement.offsetWidth);
      let degrees = Math.max(0, Math.min(360, percent));
      let color = "hsl("+ degrees +",100%, "+(degrees?"50":"100")+"%)";
      event.target.style.background = color;
    }
  }

  endStrobe(event) {
    if (!this.settings.all.enablestrobing || this.moveDrums || this.resizeDrums || this.toggleOnStates || this.toggleLoopMode) return;
    if (event.target.parentNode.classList.contains("list")) {
      document.getElementById("content").className = document.getElementById("content").className.replace(/ strobe/g,"");
    }
  }

  moveDrumsToggle() {
    this.moveDrums = !this.moveDrums;
    this.resizeDrums = false;
    this.toggleOnStates = false;
    this.toggleLoopMode = false;
  }

  resizeDrumsToggle() {
    this.resizeDrums = !this.resizeDrums;
    this.moveDrums = false;
    this.toggleOnStates = false;
    this.toggleLoopMode = false;
  }

  toggleOnStatesToggle() {
    this.toggleOnStates = !this.toggleOnStates;
    this.moveDrums = false;
    this.resizeDrums = false;
    this.toggleLoopMode = false;
  }

  toggleLoopModeToggle() {
    this.toggleLoopMode = !this.toggleLoopMode;
    this.moveDrums = false;
    this.resizeDrums = false;
    this.toggleOnStates = false;
  }

  lockSettingsToggleTime;
  lockSettingsToggleStart() {
    this.lockSettingsToggleTime = new Date();
  }

  lockSettingsToggleEnd() {
    console.log(new Date() - this.lockSettingsToggleTime);
    if (new Date() - this.lockSettingsToggleTime < 1000)
      this.lockSettings = (this.lockSettings+1)%4;
    else if (this.lockSettings > 0)
      this.lockSettings = 0;
    else
      this.lockSettings = 3;
  }

  private getStrobeTouch(touches: TouchList): Touch {
    return Array.from(touches).find(t => t.identifier==this.strobeFinger);
  }

}
