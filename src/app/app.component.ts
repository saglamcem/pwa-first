import {Component} from '@angular/core';
import {JokeService} from "./services/joke.service";
import {delay, map, Observable, tap} from "rxjs";
import {Joke} from "./model/joke";
import {InternetConnectionService} from "./services/internet-connection.service";
import {WakeLockService} from "./services/wake-lock.service";
import {NotificationService} from "./services/notification.service";

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

  // .pipe(
  //   mapTo(true),
  //   tap(() => console.log('before delay')),
  //   delay(5000),
  //   tap(() => console.log('after delay')),
  //   mapTo(false)
  // )
  // .pipe(
  //   delay(5000),
  //   map(() => false)
  // );


  constructor(
    private readonly joker: JokeService,
    private readonly connection: InternetConnectionService,
    public readonly wakeLockService: WakeLockService,
    private readonly notifications: NotificationService
  ) {
    this.wakeLockService.tryKeepScreenAliveForMinutes(3)

    this.connection.startListening();

    this.notifications.requestPermissionIfNeeded()
      .then(isAllowed => {
        if (isAllowed) {
          const body = `You'll now be notified of changes!`;
          this.notifications.createNotification('Welcome!', {body});
        }
      });
  }
}
