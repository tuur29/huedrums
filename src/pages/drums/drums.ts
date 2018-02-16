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
      this.drums = this.lights.query();
      console.log(this.drums);
    });
  }

}
