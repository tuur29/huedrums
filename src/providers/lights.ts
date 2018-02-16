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

  flash(light) {
    let url = 'lights/'+light.id+'/state';

    // this.api.put(url, {alert: "none"}).subscribe();
    this.api.put(url, {on: !light.state.on, transitiontime: 0}).subscribe(() => {
      light.state.transitiontime = 0;
      setTimeout(() => {
        this.api.put(url, light.state).subscribe(() => {
          console.log("drum done");
        });
      }, 100);
    });

  }

  toggle(light) {
    let url = 'lights/'+light.id+'/state';
    this.prepareLight(light);

    light.state.on = !light.state.on;
    this.api.put(url, light.state).subscribe();
  }

  changeSettings(light, bri: number, hue?: number) {

    let url = 'lights/'+light.id+'/state';
    this.prepareLight(light, 1);

    delete light.state.xy;
    delete light.state.ct;
    delete light.state.colormode;

    light.state.sat = 254;
    light.state.bri = Math.round(bri);
    if (hue)
      light.state.hue = Math.round(hue);

    this.api.put(url, light.state).subscribe();
  }

  private prepareLight(light, transitiontime?: number) {
    delete light.state.alert;
    delete light.state.effect;
    delete light.state.reachable;
    light.state.transitiontime = transitiontime?transitiontime:0;
  }

}
