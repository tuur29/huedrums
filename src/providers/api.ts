import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { LoadingController, ToastController, AlertController } from 'ionic-angular';


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

  logout() {
    return new Promise((resolve, reject) => {
      this.apikey = '';
      this.ip = '';
      this.storage.remove("_config").then(() => resolve() );
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
    this.showAlert(ip).then((data: any) => {

      if (data[0].error) {
        this.showToast(data[0].error.description, 5000);
        this.getApiKey(ip, resolve);
        
      } else {
        this.apikey = data[0].success.username;
        this.storage.set("_config", {ip: this.ip, apikey: this.apikey});
        resolve();
      }

    });
  }

  showAlert(ip?: string) {
    if (!ip) return this.showManualAlert(ip);
    this.ip = ip;
    return new Promise((resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: 'Allow application',
        message: "Press the button on your hue bridge to allow this application and press the 'Authenticate' button below.",
        buttons: [
          {
            text: 'Enter details manually',
            handler: data => {
              this.showManualAlert(ip).then((d) => resolve(d))
            }
          },
          {
            text: 'Authenticate',
            handler: data => {
              this.post('', { devicetype: "huedrums#"+Math.floor(Date.now()/1000) })
                .subscribe(d => resolve(d));
            }
          }
        ]
      });
      alert.present();

    });
  }

  showManualAlert(ip?: string) {
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
            text: 'Cancel', 
            handler: data => {
              this.showAlert(ip).then((data) => resolve(data))
            }
          },
          {
            text: 'Authenticate',
            handler: data => {

              this.apikey = data.apikey;
              this.ip = data.ip;

              this.get('').subscribe((d) => {
                if (d[0]) {
                  resolve(d);
                } else {
                  resolve([{success: {username: data.apikey}}]);
                }
              });
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
