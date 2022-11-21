import {Inject, Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {NAVIGATOR} from "../tokens/global";

@Injectable({providedIn: 'root'})
export class WakeLockService {
  private wakeLockSentinel: WakeLockSentinel | null;

  private remainingWakeLockTimerCounter$$: BehaviorSubject<number> | undefined;
  remainingWakeLockTimerCounter$: Observable<number> | undefined;

  constructor(@Inject(NAVIGATOR) private readonly navigator: Navigator) {
    this.wakeLockSentinel = null;
  }

  // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/dom-screen-wake-lock/dom-screen-wake-lock-tests.ts
  tryKeepScreenAliveForMinutes(minutes: number) {
    console.log(`requesting keep screen alive for ${minutes} minutes`)

    this.requestWakeLock()
      .then(lock => {
        this.remainingWakeLockTimerCounter$$ = new BehaviorSubject<number>(minutes * 60);
        this.remainingWakeLockTimerCounter$ = this.remainingWakeLockTimerCounter$$.asObservable();

        const intervalTimer = setInterval(() => {
          this.remainingWakeLockTimerCounter$$?.next(this.remainingWakeLockTimerCounter$$?.value - (1));
        }, 1000)

        const timeoutTimer = setTimeout(() => {
          this.releaseWakeLock();
          clearInterval(intervalTimer);
          console.log('lock released');
          clearTimeout(timeoutTimer);
        }, minutes * 60 * 1000);

      });
  }

  requestWakeLock(): Promise<WakeLockSentinel> {
    if (this.wakeLockSentinel) return Promise.resolve(this.wakeLockSentinel);
    return navigator.wakeLock.request('screen').then(sentinel => this.wakeLockSentinel = sentinel)
  }

  releaseWakeLock(): Promise<undefined> | undefined {
    return this.wakeLockSentinel?.release();
  }
}
