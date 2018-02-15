import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { Api } from './api';
import { Bridge } from './bridge';


@Injectable()
export class Lights {

  private lights;
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

}
