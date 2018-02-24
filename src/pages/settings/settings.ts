import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Api } from '../../providers/api';
import { Lights } from '../../providers/lights';
import { Settings } from '../../providers/settings';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  options: any;
  settingsReady = false;
  form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public splashscreen: SplashScreen,
    public api: Api,
    public lights: Lights
  ) { }

  ionViewWillEnter() {

    // load settings
    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.all;

      // add settings here & in html
      this.form = this.formBuilder.group({
        hiddendrums: [this.options.hiddendrums],
        transitiontime: [this.options.transitiontime]
      });

      this.form.valueChanges.subscribe((v) => {
        this.settings.merge(this.form.value);
      });

    });
  }

  refresh() {
    this.splashscreen.show();
    window.location.hash = "";
    window.location.reload();
  }

  logout() {
    this.api.logout().then(() => {
      this.refresh();
    });
  }

}
