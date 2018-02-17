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

  refresh() {
    this.lights.refresh().then(() => {
      this.moveDrums = false;
      this.toggleOnStates = false;
      this.drums = this.lights.query();
      console.log(this.drums);
    });
  }

  strobe(event) {
    if (event.target.classList.contains("list")) {
      let count = 0;
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
  }

  toggleOnStatesToggle() {
    this.toggleOnStates = !this.toggleOnStates;
    this.moveDrums = false;
  }

}
