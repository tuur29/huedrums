import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Bridge } from '../../providers/bridge';
import { Lights } from '../../providers/lights';


@Component({
  selector: 'page-drums',
  templateUrl: 'drums.html'
})
export class DrumsPage {

  drums: any;

  constructor(
  	public navCtrl: NavController,
  	public lights: Lights
  ) {

  	this.lights.onReady().then(() => {
  		this.drums = this.lights.query();
  	});

  }

}
