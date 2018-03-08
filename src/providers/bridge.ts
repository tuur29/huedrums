import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Api } from './api';


@Injectable()
export class Bridge {

  private bridge : any;
  private ready;

  constructor(
    public api: Api
  ) {

    this.ready = new Promise((resolve, reject) => {
      this.api.onReady().then(() => {
        this.query().subscribe(() => {
          resolve();
        });
      });
    });
  }

  onReady() {
    return this.ready;
  }

  getLights(force?: boolean) {
    let array = [];
    if (this.bridge)
      for (let key in this.bridge.lights) {
        let light = this.bridge.lights[key];
        if (!light.state.on)
          light.state.bri = Math.round(255/2);
        light.id = key;
        array.push(light);
      }
    return array;
  }

  query(force?: boolean) {

    if (this.bridge && !force) return Observable.of(this.bridge);

    let loader = this.api.showLoader();
    return this.api.get('').map((d: any) => {

      if (loader) loader.dismiss();
      if (!d) {
        this.api.showToast();
        return null;
      }

      this.bridge = d;
      return this.bridge;

    }).catch((error) => {
      if (loader) loader.dismiss();
      this.api.showToast("Saved Hue bridge cannot be reached, go to settings to logout from your saved bridge", 100000);
      return Observable.of(null);
    });
  }

}
