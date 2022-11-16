import { Component } from '@angular/core';
import { JokeService } from "./services/joke.service";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Joke } from "./model/joke";
import { InternetConnectionService } from "./services/internet-connection.service";
import { WakeLockService } from "./services/wake-lock.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pwa-first';
  joke$: Observable<Joke> = this.joker.getJoke();

  lostConnection$ = this.connection.lostConnection$;

  displayConnectionBar$: BehaviorSubject<{ value: boolean }> = new BehaviorSubject<{ value: boolean }>({value: false});
  displayConnectionBar$$: Observable<{ value: boolean }> = this.displayConnectionBar$.asObservable()
    .pipe(tap((value) => console.log(`received ${JSON.stringify(value)}`)));

  constructor(
    private readonly joker: JokeService,
    private readonly connection: InternetConnectionService,
    public readonly wakeLockService: WakeLockService
  ) {
    this.wakeLockService.tryKeepScreenAliveForMinutes(3)

    this.connection.startListening();
  }
}
