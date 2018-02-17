import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DrumsPage } from '../pages/drums/drums';


@Component({
  templateUrl: 'app.html'
})
export class HueDrumsApp {
  rootPage:any = DrumsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      statusBar.styleBlackTranslucent();
      splashScreen.hide();
    });
  }
}

