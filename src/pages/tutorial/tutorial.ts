import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage {

  slide: number = 0;
  loop;
  enableDrumToast = true;
  enableStrobeToast = true;
  enableLoopToast = true;

  lastLoopTouch = 0;

  constructor(
    public navCtrl: NavController,
    public navparams: NavParams,
    public storage: Storage,
    private toastCtrl: ToastController
  ) { }

  ionSlideWillChange(event) {
    this.slide = event.getActiveIndex();
  }


  holdNormalDrum() {
    if (this.enableDrumToast) {
      this.toastCtrl.create({
        message: "Your Hue Bridge isn't connected yet, so just imagine the screen as one of your lamps.",
        duration: 3000,
        position: 'bottom'
      }).present();
      this.enableDrumToast = false;
    }

    let element = document.getElementById("examplenormal");
    let colors = ["#FF5722", "#FFEB3B", "#CDDC39", "#8BC34A", "#4CAF50", "#009688", "#00BCD4", "#F44336"];
    element.style.backgroundColor = colors[Math.floor(Math.random()*colors.length)];
  }

  leaveNormalDrum() {
    let element = document.getElementById("examplenormal");
    element.style.backgroundColor = "#455A64";
  }

  pressStrobeDrum(event) {
    event.stopPropagation();
    if (this.enableStrobeToast) {
      this.enableStrobeToast = false;
      let toast = this.toastCtrl.create({
        message: "Drums are the only place where holding won't work!",
        duration: 3000,
        position: 'bottom'
      });
      toast.onDidDismiss(() => {
        this.enableStrobeToast = true;
      });
      toast.present();
    }
  }

  holdStrobe() {
    let element = document.getElementById("examplestrobe");
    element.className += " animate";
  }

  leaveStrobe() {
    let element = document.getElementById("examplestrobe");
    let classes = element.className.replace(" animate","");
    element.className = classes;
  }

  holdLoop() {
    let time = (new Date).getTime();
    console.log(this.lastLoopTouch, time);
    if (this.lastLoopTouch && time - this.lastLoopTouch < 2000) {

      let element = document.getElementById("exampleloop");
      element.style.animation = "strobe "+ (time-this.lastLoopTouch) +"ms steps(1, end) infinite";

      if (this.enableLoopToast) {
        this.toastCtrl.create({
          message: "Again, use your imagination here. The screen is a lamp for the time being.",
          duration: 3000,
          position: 'bottom'
        }).present();
        this.enableLoopToast = false;
      }

    }
    this.lastLoopTouch = time;

  }

  leaveLoop() {
    let element = document.getElementById("exampleloop");
    element.style.animation = "";
  }

  pressCustomizeDrum() {
    let element = document.getElementById("examplecustomize");
    let classes = element.className;
    element.className += " animate";
    setTimeout(() => {
      element.className = classes;
    }, 2000);
  }

  finish() {
    // TODO: enable skiptutorial
    this.storage.set("_skiptutorial", false);
    this.navCtrl.setRoot('DrumsPage', {}, {animate: true, direction: 'backward'});
  }
}
