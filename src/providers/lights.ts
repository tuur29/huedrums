import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Api } from './api';
import { Bridge } from './bridge';


@Injectable()
export class Lights {

  private ready;

  constructor(
    public api: Api,
    public bridge: Bridge
  ) {

    this.ready = new Promise((resolve, reject) => {
      this.bridge.onReady().then(() => {
        resolve();
      });
    });
  }

  onReady() {
    return this.ready;
  }

  query() {
    return this.bridge.getLights();
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
    this.api.put(url, {on: !light.state.on, transitiontime: 0}).subscribe(() => {
      light.state.transitiontime = 0;
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
      transitiontime: 0
    };

    if (light.state.on)
      if (light.type.toLowerCase().indexOf("color") > -1)
        state.hue = light.state.hue;
      else if (light.type.toLowerCase().indexOf("temperature") > -1)
        state.ct = light.state.hue;

    this.api.put(url, state).timeout(500).onErrorResumeNext(Observable.empty()).subscribe();
  }

  changeSettings(light, bri: number, hue?: number) {

    let url = 'lights/'+light.id+'/state';

    light.state.bri = Math.round(bri);
    if (hue)
      light.state.hue = Math.round(hue);

    if (!light.state.on) return;

    let state = {
      bri: Math.round(bri),
      transitiontime: 1
    };

    if (light.state.on) {
      if (light.type.toLowerCase().indexOf("color") > -1) {
        state.hue = hue ? Math.round(hue) : 0;
        state.sat = 254;
      } else if (light.type.toLowerCase().indexOf("temperature") > -1){
        state.ct = hue ? Math.round(hue) : 0;
      }
    }

    this.api.put(url, state).timeout(500).onErrorResumeNext(Observable.empty()).subscribe();
  }

}
