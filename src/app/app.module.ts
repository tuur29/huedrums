import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AndroidFullScreen } from '@ionic-native/android-full-screen';
import { NativeAudio } from '@ionic-native/native-audio';

import { Api } from '../providers/api';
import { Bridge } from '../providers/bridge';
import { Lights } from '../providers/lights';
import { Noise } from '../providers/noise';
import { Settings } from '../providers/settings';

import { App } from './app';

export function provideSettings(storage: Storage) {
  return new Settings(storage, {
    hiddendrums: [],
    transitiontime: 0,
    enablestrobing: true,
    strobespeed: 100,
    loopflashlength: 200,
    enablesounds: false
  });
}


@NgModule({
  declarations: [
    App
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(App),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    App
  ],
  providers: [
    Api,
    Bridge,
    Lights,
    Noise,
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    AndroidFullScreen,
    NativeAudio,
    {provide: Settings, useFactory: provideSettings, deps: [Storage]},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
