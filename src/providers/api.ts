import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

import { LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Settings } from './settings';


@Injectable()
export class Api {
  
  public apikey: string = '';
  public ip: string = '';

  private loader;
  private ready;

  private countPerSecond = 0;
  private countToast;

  constructor(
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public storage: Storage,
    public settings: Settings
  ) {

    setInterval(() => {
      this.countPerSecond = 0;
    }, 1000);

    this.ready = new Promise((resolve, reject) => {
      this.storage.get("_config").then((session) => {

        if (session) {  
          this.apikey = session.apikey;
          this.ip = session.ip;
          resolve();

        } else {

          let loader = this.showLoader();
          this.http.get('https://www.meethue.com/api/nupnp').subscribe((data: any[]) => {
            loader.dismiss();
            if (data.length < 1) {
              this.showToast("There are no Hue Bridges on this network. Re-open this app to try again.", 100000);
              this.showManualAlert();
            } else {
              this.selectBridge(data, resolve);
            }
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

    if(this.checkCount()) return Observable.of(null);
    return this.http.get(this.url()+endpoint, reqOpts);
  }

  post(endpoint: string, body: any, reqOpts?: any) {
    if(this.checkCount()) return Observable.of(null);
    return this.http.post(this.url()+endpoint, body, reqOpts);
  }

  put(endpoint: string, body: any, reqOpts?: any) {
    if(this.checkCount()) return Observable.of(null);
    return this.http.put(this.url()+endpoint, body, reqOpts);
  }

  delete(endpoint: string, reqOpts?: any) {
    if(this.checkCount()) return Observable.of(null);
    return this.http.delete(this.url()+endpoint, reqOpts);
  }

  patch(endpoint: string, body: any, reqOpts?: any) {
    if(this.checkCount()) return Observable.of(null);
    return this.http.put(this.url()+endpoint, body, reqOpts);
  }

  url() {
    return "http://" + this.ip + "/api/" + this.apikey + "/";
  }


  // HELPERS

  private selectBridge(data: any[], resolve) {

    if (data.length == 1) {
      this.getApiKey(data[0].internalipaddress, resolve);
      return;
    }

    let alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: 'Select Hue Bridge',
      message: "You have more than one Hue Bridge connected to your network.",
      buttons: [
        {
          text: 'Select',
          handler: ip => {
            if (!ip) return false;
            this.getApiKey(ip, resolve);
          }
        }
      ]
    });

    for (let bridge of data)
      alert.addInput({
        type: 'radio',
        label: (bridge.name || bridge.macaddress || bridge.id) + " ("+bridge.internalipaddress+")",
        value: bridge.internalipaddress
      });

    alert.present();
    
  }

  private getApiKey(ip: string, resolve) {
    this.showAlert(ip).then((data: any) => {

      if (data[0].error) {
        let msg = data[0].error.description;
        this.showToast(msg.charAt(0).toUpperCase() + msg.slice(1), 5000);
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
        enableBackdropDismiss: false,
        title: 'Allow application',
        message: `<p>Press the button on your hue bridge to allow this application and press the 'Authenticate' button below.</p><p> Current bridge: ${ip}</p>`,
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
        enableBackdropDismiss: false,
        title: 'Manually allow app',
        message: `<p>You can get a api key for your hue bridge manually by following <a href="https://developers.meethue.com/documentation/getting-started">these steps</a>.</p>`,
        inputs: [
          {
            name: 'ip',
            placeholder: 'IP-Address of bridge',
            value: ip ? ip : ''
          },
          {
            name: 'apikey',
            placeholder: 'Apikey for bridge',
            value: ''
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
              if (!data.ip.length || !data.apikey.length) return false;

              this.apikey = data.apikey;
              this.ip = data.ip;

              this.get('').subscribe((d) => {
                if (d[0]) {
                  resolve(d);
                  alert.dismiss();
                } else {
                  resolve([{success: {username: data.apikey}}]);
                  alert.dismiss();
                }
              });

              return false;
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
    return toast;
  }

  private checkCount() {
    this.countPerSecond++;
    if (this.countPerSecond > 10) {
      if (!this.countToast)
        this.countToast = this.showToast("A Hue bridge can only handle around 10 requests/second. The bridge might become unresponsive for a few seconds if you send more.", 5000);
      return this.settings.all.forceapilimit;
    }
    return false;
  }

}
