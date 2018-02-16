import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { IonicStorageModule } from '@ionic/storage';

import { Api } from '../providers/api';
import { Bridge } from '../providers/bridge';
import { Lights } from '../providers/lights';

import { HueDrumsApp } from './app.component';
import { DrumsPage } from '../pages/drums/drums';
import { DrumDirective } from '../directives/drum';
import { MoveableDirective } from '../directives/moveable';

@NgModule({
  declarations: [
    HueDrumsApp,
    DrumsPage,
    DrumDirective,
    MoveableDirective
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(HueDrumsApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    HueDrumsApp,
    DrumsPage
  ],
  providers: [
    Api,
    Bridge,
    Lights,
    StatusBar,
    SplashScreen,
    AndroidFullScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
