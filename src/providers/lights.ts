import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Api } from './api';
import { Bridge } from './bridge';
import { Settings } from './settings';


@Injectable()
export class Lights {

  private ready;

  constructor(
    public api: Api,
    public bridge: Bridge,
    public settings: Settings
  ) {
    this.ready = Promise.all([
      this.bridge.onReady(),
      this.settings.load()
    ]);
  }

  onReady() {
    return this.ready;
  }

  query(forceAll?: boolean) {
    // TODO: filter lights base on hiddendrums setting

    return this.bridge.getLights().filter((l) => {
      if (!forceAll)
        if (this.settings.all.hiddendrums.indexOf(l.uniqueid) > -1)
          return false;
      return true
    });
  }

  refresh() {
    return new Promise((resolve, reject) => {
      this.bridge.query(true).subscribe(() => {
        resolve();
      });
    });
  }

  flash(light) {
    let url = 'lights/'+light.id+'/state';

    // this.api.put(url, {alert: "none"}).subscribe();
    this.api.put(url, {on: !light.state.on, transitiontime: this.settings.all.transitiontime}).subscribe(() => {
      light.state.transitiontime = this.settings.all.transitiontime;
      setTimeout(() => {
        this.api.put(url, light.state).timeout(500).onErrorResumeNext(Observable.empty()).subscribe();
      }, 100);
    });

  }

  toggle(light) {
    let url = 'lights/'+light.id+'/state';
    light.state.on = !light.state.on;

    let state = {
      on: light.state.on,
      bri: light.state.bri,
      transitiontime: this.settings.all.transitiontime
    };

    if (light.state.on)
      if (light.type.toLowerCase().indexOf("color") > -1)
        state['hue'] = light.state.hue;
      else if (light.type.toLowerCase().indexOf("temperature") > -1)
        state['ct'] = light.state.hue;

    this.api.put(url, state).timeout(500).onErrorResumeNext(Observable.empty()).subscribe();
  }

  changeSettings(light, bri: number, hue?: number) {

    let url = 'lights/'+light.id+'/state';

    light.state.bri = Math.round(bri);
    if (hue != undefined)
      light.state.hue = Math.round(hue);

    if (!light.state.on) return;

    let state = {
      bri: Math.round(bri),
      transitiontime: 2
    };

    if (light.type.toLowerCase().indexOf("color") > -1) {
      state['hue'] = hue ? Math.round(hue) : light.state.hue;
      state['sat'] = 254;
    } else if (light.type.toLowerCase().indexOf("temperature") > -1){
      state['ct'] = hue ? Math.round(hue) : light.state.hue;
    }

    this.api.put(url, state).timeout(500).onErrorResumeNext(Observable.empty()).subscribe();

  }

}
