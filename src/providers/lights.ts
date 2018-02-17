import { Injectable } from '@angular/core';

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
    let lights = this.bridge.getLights();
    lights.forEach((light) => {
      light.state.bri > 1 ? light.state.bri : Math.round(255/2);
    });
    return lights
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
        this.api.put(url, light.state).timeout(500).subscribe();
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
    this.api.put(url, state).timeout(500).subscribe();
  }

  changeSettings(light, bri: number, hue?: number) {

    let url = 'lights/'+light.id+'/state';

    light.state.sat = 254;
    light.state.bri = Math.round(bri);
    if (hue)
      light.state.hue = Math.round(hue);

    let state = {
      sat: 254,
      bri: Math.round(bri),
      hue: hue ? Math.round(hue) : 0,
      transitiontime: 1
    };
    this.api.put(url, state).timeout(500).subscribe();
  }

}
