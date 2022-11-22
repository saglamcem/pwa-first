import {Inject, Injectable, OnDestroy} from "@angular/core";
import {
  BehaviorSubject,
  distinctUntilChanged,
  EMPTY,
  fromEvent,
  map,
  Observable,
  startWith,
  Subscription,
  switchMap,
  takeWhile,
  tap,
  timer
} from "rxjs";
import {NAVIGATOR} from "../tokens/global";

@Injectable({providedIn: 'root'})
export class WakeLockService implements OnDestroy {
  private wakeLockSentinel: WakeLockSentinel | null;

  private remainingWakeLockTimerCounter$$: BehaviorSubject<number> | undefined;
  remainingWakeLockTimerCounter$: Observable<number> | undefined;

  private wakeLockSinceTimerCounter$$: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  wakeLockSinceTimerCounter$: Observable<number> = this.wakeLockSinceTimerCounter$$.asObservable();

  private wakeLockStatus$$: BehaviorSubject<string> = new BehaviorSubject<string>(document.visibilityState);
  wakeLockStatus$: Observable<string> = this.wakeLockStatus$$.asObservable();

  private readonly subSink: Subscription = new Subscription();

  readonly visibilityState$: Observable<DocumentVisibilityState> = fromEvent(document, 'visibilitychange')
    .pipe(
      startWith('visible'),
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
    this.visibilityState$
      .pipe(
        switchMap(state => {
          if (state === 'visible') {
            console.log(`%cstate: ${state} - requesting wake lock`, 'font-weight: bold; color: green;');
            this.requestWakeLock()
              .then(lock => {
                console.log('requested wake lock')
                return timer(0, 1000)
                  .pipe(
                    tap((count) => this.wakeLockSinceTimerCounter$$.next(count + 1)),
                    takeWhile(() => document.visibilityState === 'visible')
                  );
              });
          }
          else {
            this.releaseWakeLock();
            return EMPTY
          }
        })
      ).subscribe()
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

  requestWakeLock(): Promise<WakeLockSentinel | void> {
    if (this.wakeLockSentinel) {
      this.wakeLockStatus$$.next(`${document.visibilityState} - using existing wakeLockSentinel for wake lock`)

      return Promise.resolve(this.wakeLockSentinel);
    }

    return navigator?.wakeLock?.request('screen')
      .then(sentinel => {
        this.wakeLockStatus$$.next(`${document.visibilityState} - received wakeLockSentinel for wake lock`)
        this.wakeLockSentinel = sentinel
      })
      .catch(err => {
        this.wakeLockStatus$$?.next(`failed to get wakeLock:\n ${JSON.stringify(err, null, 2)}`)
        return;
      })
  }

  releaseWakeLock(): Promise<undefined | void> | undefined {
    return this.wakeLockSentinel?.release()
      .then(lock => {
        this.wakeLockStatus$$.next(`${document.visibilityState} - releasing wake lock`)
        this.wakeLockSinceTimerCounter$$.next(1)
      })
      .catch(err => this.wakeLockStatus$$?.next(`error releasing wake lock: \n${JSON.stringify(err, null, 2)}`));
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
}
