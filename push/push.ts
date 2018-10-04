import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { Platform, ToastController } from 'ionic-angular';

const targetUrl = "";

@Injectable()
export class PushProvider {

  constructor(public http: HttpClient, public push: Push, public platform: Platform, public toastCtrl: ToastController) {
    
    platform.ready().then(() => {
      this.push.hasPermission()
      .then((res: any) => {

        if (res.isEnabled) {
          console.log('We have permission to send push notifications');
          this.pushSetUp();
        } else {
          console.log('We do not have permission to send push notifications');
        }
      });
    });
  }

  pushSetUp() {
    // Push Notification Configuration
    const options: PushOptions = {
      android: {
        senderID: '29083641251',
        sound : true,
        vibrate:true,
        forceShow:true,        
      },
      ios: {
        alert: 'true',
        badge: 'true',
        sound: 'true',
        clearBadge: 'true'
      },
      windows: {}
    };

    // Event Listeners 
    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      // Notification 
      console.log('Received a notification', notification) 
      // let toast = this.toastCtrl.create({
      //               message: notification,
      //               duration:3000
      //             });
      // toast.present();
    });

    pushObject.on('registration').subscribe((registration: any) => {

      console.log('Device registered', registration) 
      // Add Token to the server
      // this.http.post(targetUrl, { token : registration })
      //     .subscribe((res) => console.log(res));

    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  }
  

}
