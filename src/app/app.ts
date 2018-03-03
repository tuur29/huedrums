import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  template: `

    <ion-nav [root]="rootPage"></ion-nav>

  `
})
export class App {
  rootPage: any = "DrumsPage";

  constructor(
  	platform: Platform,
    statusBar: StatusBar,
  	splashScreen: SplashScreen
  ) {
    platform.ready().then(() => {
      statusBar.styleBlackTranslucent();
      splashScreen.hide();
    });

  }
}

