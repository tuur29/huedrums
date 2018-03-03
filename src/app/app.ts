import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

@Component({
  template: `

    <ion-nav [root]="rootPage"></ion-nav>

  `
})
export class App {
  rootPage: any;

  constructor(
  	platform: Platform,
    statusBar: StatusBar,
  	splashScreen: SplashScreen,
    storage: Storage
  ) {
    storage.get("_skiptutorial").then((data) => {
      if (data)
        this.rootPage = "DrumsPage";
      else
        this.rootPage = "TutorialPage";

      platform.ready().then(() => {
        statusBar.styleBlackTranslucent();
        splashScreen.hide();
      });      
    });

  }
}

