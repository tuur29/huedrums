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
import { TooltipsModule } from 'ionic-tooltips';

import { Api } from '../providers/api';
import { Bridge } from '../providers/bridge';
import { Lights } from '../providers/lights';
import { Settings } from '../providers/settings';

import { HueDrumsApp } from './app.component';
import { DrumsPage } from '../pages/drums/drums';
import { DrumDirective } from '../directives/drum';
import { MoveableDirective } from '../directives/moveable';
import { ResizableDirective } from '../directives/resizable';
import { LoopableDirective } from '../directives/loopable';

export function provideSettings(storage: Storage) {
  return new Settings(storage, {
    hiddendrums: [],
    transitiontime: 0
  });
}


@NgModule({
  declarations: [
    HueDrumsApp,
    DrumsPage,
    DrumDirective,
    MoveableDirective,
    ResizableDirective,
    LoopableDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    IonicModule.forRoot(HueDrumsApp),
    IonicStorageModule.forRoot(),
    TooltipsModule
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
    ScreenOrientation,
    AndroidFullScreen,
    {provide: Settings, useFactory: provideSettings, deps: [Storage]},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
