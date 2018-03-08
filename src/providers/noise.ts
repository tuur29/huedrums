import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { NativeAudio } from '@ionic-native/native-audio';
import { Settings } from './settings';

@Injectable()
export class Noise {

  constructor(
    private nativeAudio: NativeAudio,
    public settings: Settings
  ) {
    this.nativeAudio.preloadSimple('kick', 'assets/CYCdh_ElecK06-Kick01.wav');
    this.nativeAudio.preloadSimple('bass', 'assets/CYCdh_ElecK06-Clap03.wav');
  }

  playKick() {
    if (!this.settings.all.enablesounds) return;
    this.nativeAudio.play('kick');
  }

  playBass() {
    if (!this.settings.all.enablesounds) return;
    this.nativeAudio.play('bass');
  }

}
