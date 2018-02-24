import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Lights } from '../../providers/lights';


@Component({
  selector: 'page-drums',
  templateUrl: 'drums.html'
})
export class DrumsPage {

  drums: any;
  moveDrums: boolean = false;
  toggleOnStates: boolean = false;
  lockSettings: boolean = false;
  strobeLoop;

  constructor(
  	public navCtrl: NavController,
  	public lights: Lights
  ) {

  	this.lights.onReady().then(() => {
      this.drums = this.lights.query();
      console.log(this.drums);
    });

  }

  openSettings() {
    this.navCtrl.push('SettingsPage');
  }

  refresh() {
    this.lights.refresh().then(() => {
      this.moveDrums = false;
      this.toggleOnStates = false;
      this.lockSettings = false;
      this.drums = this.lights.query();
      console.log(this.drums);
    });
  }

  strobe(event) {
    if (this.moveDrums || this.toggleOnStates) return;
    if (event.target.classList.contains("list")) {
      event.target.style.background = "#fff";
      let count = 1;
      clearInterval(this.strobeLoop);
      this.strobeLoop = setInterval(() => {
        event.target.style.background = count%2 ? "#fff" : "unset";
        count++;
      }, 50);
    }
  }

  endStrobe(event) {
    if (event.target.classList.contains("list")) {
      clearInterval(this.strobeLoop);
      event.target.style.background = "unset";
    }
  }

  moveDrumsToggle() {
    this.moveDrums = !this.moveDrums;
    this.toggleOnStates = false;
    this.lockSettings = false;
  }

  toggleOnStatesToggle() {
    this.toggleOnStates = !this.toggleOnStates;
    this.moveDrums = false;
    this.lockSettings = false;
  }

  lockSettingsToggle() {
    this.lockSettings = !this.lockSettings;
    this.moveDrums = false;
    this.toggleOnStates = false;
  }

}
