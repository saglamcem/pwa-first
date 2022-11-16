import { Injectable, OnDestroy } from '@angular/core';
import { filter, fromEvent, map, Observable, pairwise, ReplaySubject, Subscription, tap } from "rxjs";

export type ConnectionStatus = 'online' | 'offline'

@Injectable({
  providedIn: 'root'
})
export class InternetConnectionService implements OnDestroy {
  private readonly subSink: Subscription = new Subscription();

  readonly onlineEvent$: Observable<ConnectionStatus> = fromEvent(window, 'online')
    .pipe(
      map(() => 'online' as ConnectionStatus),
      tap((value) => this.connectionStatus$.next(value))
    )

  readonly offlineEvent$: Observable<ConnectionStatus> = fromEvent(window, 'offline')
    .pipe(
      map(() => 'offline' as ConnectionStatus),
      tap((value) => this.connectionStatus$.next(value))
    )

  readonly connectionStatus$: ReplaySubject<ConnectionStatus> = new ReplaySubject(1);

  private readonly connectionStatusPair$: Observable<[ConnectionStatus, ConnectionStatus]> = this.connectionStatus$
    .pipe(
      pairwise(),
      tap(([f, s]) => console.log(`[connectionStatusPair$]: f: ${f}, s: ${s}`)),
    )

  readonly lostConnection$: Observable<boolean> = this.connectionStatusPair$
    .pipe(
      map(([f, s]) => f === 'online' && s === 'offline'),
      filter(v => v)
    )

  readonly reconnected$: Observable<boolean> = this.connectionStatusPair$
    .pipe(
      map(([f, s]) => f === 'offline' && s === 'online'),
      filter(v => v)
    )

  constructor() {
    const onlineEventsSub = this.onlineEvent$.subscribe(console.log)
    const offlineEventsSub = this.offlineEvent$.subscribe(console.log)

    this.subSink.add(onlineEventsSub)
    this.subSink.add(offlineEventsSub)
  }

  ngOnDestroy(): void {
    console.log('getting rid of online/offline subs in service')
    this.subSink.unsubscribe()
  }
}
