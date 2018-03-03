import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { Api } from '../../providers/api';
import { Lights } from '../../providers/lights';
import { Settings } from '../../providers/settings';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  callback;
  options: any;
  settingsReady = false;
  form: FormGroup;
  lights: any[];
  dirty = false;

  constructor(
    public navCtrl: NavController,
    public navparams: NavParams,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public splashscreen: SplashScreen,
    public storage: Storage,
    public api: Api,
    public l: Lights
  ) {
    this.callback = this.navparams.get('callback');
  }

  ionViewWillEnter() {

    // load settings
    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.all;

      // add settings here & in html
      this.form = this.formBuilder.group({
        transitiontime: [this.options.transitiontime]
      });

      this.form.valueChanges.subscribe((v) => {
        this.settings.merge(this.form.value);
      });

    });

    this.l.onReady().then(() => {
      this.lights = this.l.query(true);
    });

  }

  ionViewDidLeave() {
    if (this.dirty)
      this.callback(true);
  }

  refresh() {
    this.storage.keys().then((keys) => {
      keys.forEach((id, index) => {
        if (id.indexOf('_light') == 0) {
          this.storage.remove(id);
        }
      });
    });

    this.navCtrl.pop();
    this.callback(true);
  }

  logout() {
    this.api.logout().then(() => {
      this.splashscreen.show();
      window.location.hash = "";
      window.location.reload();
    });
  }

  checkHidden(event, value) {

    let array = this.settings.all.hiddendrums;
    if (event.value) {
      if (array.indexOf(value) < 0)
        array.push(value)
    } else {
      if (array.indexOf(value) > -1)
        array.splice(array.indexOf(value),1);
    }
    this.settings.setValue("hiddendrums", array);
    this.dirty = true;

  }

}
