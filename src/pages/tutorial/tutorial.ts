import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {

  constructor(
    public navCtrl: NavController,
    public navparams: NavParams,
    public storage: Storage
  ) {
  }

  finish() {
  	this.storage.set("_skiptutorial", true);
  	this.navCtrl.setRoot('DrumsPage', {}, {animate: true, direction: 'backward'});
  }
}
