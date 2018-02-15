import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { LoadingController, ToastController, AlertController } from 'ionic-angular';

// TODO: improve login experience by using bridge button

@Injectable()
export class Api {
  
  public apikey: string = '';
  public ip: string = '';

  private loader;
  private ready;

  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public storage: Storage
  ) {

    this.ready = new Promise((resolve, reject) => {
      this.storage.get("_config").then((session) => {

        if (session) {  
          this.apikey = session.apikey;
          this.ip = session.ip;
          resolve();

        } else {

          let loader = this.showLoader();
          this.http.get('https://www.meethue.com/api/nupnp').subscribe((data) => {
            loader.dismiss();
            this.getApiKey(data[0].internalipaddress, resolve);
          });

        }
      });
    });

  }

  onReady() {
    return this.ready;
  }

  get(endpoint: string, params?: any, reqOpts?: any) {
    if (!reqOpts) {
      reqOpts = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      reqOpts.params = new HttpParams();
      for (let k in params) {
        reqOpts.params = reqOpts.params.set(k, params[k]);
      }
    }

    return this.http.get(this.url()+endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    return this.http.post(this.url()+endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url()+endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    return this.http.delete(this.url()+endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    return this.http.put(this.url()+endpoint, body, reqOpts);
  }

  url() {
    return "http://" + this.ip + "/api/" + this.apikey + "/";
  }


  // HELPERS

  private getApiKey(ip: string, resolve) {
    this.showAlert(ip).then((data) => {

      this.apikey = data.apikey;
      this.ip = data.ip;

      this.get('').subscribe((d) => {
        if (d[0]) {
          this.showToast(d[0].error.description, 5000);
          this.getApiKey(ip, resolve);
          
        } else {
          this.storage.set("_config", data);
          resolve();
        }
      });
    });
  }

  showAlert(ip?: string) {
    return new Promise((resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: 'Allow application',
        inputs: [
          {
            name: 'ip',
            placeholder: 'IP-Address of bridge',
            value: ip ? ip : ''
          },
          {
            name: 'apikey',
            placeholder: 'Apikey for bridge',
          }
        ],
        buttons: [
          {
            text: 'Authenticate',
            handler: data => {
              resolve(data);
            }
          }
        ]
      });
      alert.present();

    });
  }

  showLoader() {
    if (this.loader) return undefined;
    this.loader = this.loadingCtrl.create({spinner: "crescent"});
    this.loader.present();
    this.loader.onDidDismiss(() => {
      this.loader = undefined;
    });
    return this.loader;
  }

  showToast(text?: string, timeout?: number) {
    let toast = this.toastCtrl.create({
      message: (text ? text : "Something went wrong"),
      showCloseButton: true,
      closeButtonText: "Close",
      duration: timeout ? timeout : 3000
    });
    toast.present();
  }

}
