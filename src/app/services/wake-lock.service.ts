import {Inject, Injectable, OnDestroy} from "@angular/core";
import {BehaviorSubject, distinctUntilChanged, fromEvent, map, Observable, Subscription, tap} from "rxjs";
import {NAVIGATOR} from "../tokens/global";

@Injectable({providedIn: 'root'})
export class WakeLockService implements OnDestroy {
  private wakeLockSentinel: WakeLockSentinel | null;

  private remainingWakeLockTimerCounter$$: BehaviorSubject<number> | undefined;
  remainingWakeLockTimerCounter$: Observable<number> | undefined;

  private wakeLockStatus$$: BehaviorSubject<string> = new BehaviorSubject<string>(document.visibilityState);
  wakeLockStatus$: Observable<string> = this.wakeLockStatus$$.asObservable();

  private readonly subSink: Subscription = new Subscription();

  readonly visibilityState$: Observable<DocumentVisibilityState> = fromEvent(document, 'visibilitychange')
    .pipe(
      tap((value) => console.log('*** visibilitychange ***')),
      map(() => document.visibilityState),
      tap((value) => {
        console.log(`%c${value}`, 'font-weight: bold; color: red;');
      }),
      distinctUntilChanged()
    )

  constructor(@Inject(NAVIGATOR) private readonly navigator: Navigator) {
    this.wakeLockSentinel = null;
  }

  enableWakeLockDependingOnVisibility(): void {
    const visibilitySubscription = this.visibilityState$
      .pipe(
        tap(state => {
          if (state === 'visible') {
            console.log(`%cstate: ${state} - requesting wake lock`, 'font-weight: bold; color: green;');
            this.requestWakeLock();
          }
          else {
            console.log(`%cstate: ${state} - releasing wake lock`, 'font-weight: bold; color: purple;');
            this.releaseWakeLock();
          }
        })
      )
      .subscribe();

    this.subSink.add(visibilitySubscription);
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
    console.log('(requesting wake lock)')

    this.wakeLockStatus$$?.next(`${document.visibilityState} - requesting wake lock`)

    if (this.wakeLockSentinel) {
      console.log('(returning existing sentinel)')
      return Promise.resolve(this.wakeLockSentinel);
    }

    console.log('(returning actual request result sentinel)')
    return navigator?.wakeLock?.request('screen').then(sentinel => this.wakeLockSentinel = sentinel)
  }

  releaseWakeLock(): Promise<undefined> | undefined {
    console.log('(releasing wake lock)')
    this.wakeLockStatus$$?.next(`${document.visibilityState} - releasing wake lock`)

    return this.wakeLockSentinel?.release();
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
}
