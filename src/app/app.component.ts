import {Component} from '@angular/core';
import {JokeService} from "./services/joke.service";
import {delay, map, Observable, tap} from "rxjs";
import {Joke} from "./model/joke";
import {InternetConnectionService} from "./services/internet-connection.service";
import {WakeLockService} from "./services/wake-lock.service";
import {NotificationService} from "./services/notification.service";
import {SwPush, SwUpdate} from "@angular/service-worker";
import {SwRelatedService} from "./services/sw-related.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pwa-first';
  joke$: Observable<Joke> = this.joker.getJoke();

  reconnected$ = this.connection.reconnected$.pipe(
    tap((val) => console.warn(`reconnected$: ${JSON.stringify(val, null, 2)}`)),
    delay(5000),
    map(() => ({value: false}))
  )

  lostConnection$ = this.connection.lostConnection$.pipe(
    tap((val) => console.warn(`lostConnection$: ${JSON.stringify(val, null, 2)}`))
  )

  version: number = 9;

  constructor(
    private readonly joker: JokeService,
    private readonly connection: InternetConnectionService,
    public readonly wakeLockService: WakeLockService,
    public readonly notifications: NotificationService,
    private readonly swUpdate: SwUpdate,
    private readonly swPush: SwPush,
    private readonly swRelatedServices: SwRelatedService
  ) {
    this.wakeLockService.tryKeepScreenAliveForMinutes(3)

    this.connection.startListening();

    // this.notifications.requestPermissionIfNeeded()
    //   .then(isAllowed => {
    //     if (isAllowed) {
    //       const body = `You'll now be notified of changes!`;
    //       this.notifications.createBasicNotification('Welcome!', {body});
    //
    //       navigator.serviceWorker.ready.then((registration) => {
    //         const buzzConfirmation = confirm('Can we buzz you?')
    //
    //         if (buzzConfirmation) {
    //           registration.showNotification("Vibration Sample", {
    //             body: "Buzz! Buzz!",
    //             icon: "../images/touch/chrome-touch-icon-192x192.png",
    //             vibrate: [200, 100, 200, 100, 200, 100, 200],
    //             actions: [],
    //             tag: "vibration-sample",
    //           });
    //         }
    //
    //       });
    //
    //     }
    //   });

    this.notifications.pushSubscription();
  }

  buzz(): void {
    navigator.vibrate([200, 100, 200, 100, 200, 100, 200])
  }
}
