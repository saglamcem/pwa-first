import {Inject, Injectable, OnDestroy} from '@angular/core';
import {
  distinctUntilChanged,
  fromEvent,
  map,
  Observable,
  Observer,
  pairwise,
  ReplaySubject,
  Subscription,
  tap
} from "rxjs";
import {DOCUMENT} from "@angular/common";

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
      distinctUntilChanged(),
      pairwise(),
      tap(([f, s]) => console.log(`[connectionStatusPair$]: f: ${f}, s: ${s}`)),
      tap(() => console.log('sending pair'))
    )

  readonly lostConnection$: Observable<{ value: boolean }> = this.connectionStatusPair$
    .pipe(
      map(([f, s]) => ({value: f === 'online' && s === 'offline'})),
      tap(() => console.log('lostConnection$'))
    )

  readonly reconnected$: Observable<{ value: boolean }> = this.connectionStatusPair$
    .pipe(
      map(([f, s]) => ({value: f === 'offline' && s === 'online'})),
      tap(() => console.log('reconnected$'))
    );

  startListening(): void {
    const observer: Observer<any> = {
      next: value => console.log(value),
      error: err => console.error(err),
      complete: () => console.log('completed')
    }
    const onlineEventsSub = this.onlineEvent$.subscribe({...observer})
    const offlineEventsSub = this.offlineEvent$.subscribe({...observer})
    const connectionStatus: ConnectionStatus = navigator.onLine
      ? 'online'
      : 'offline';

    this.connectionStatus$.next(connectionStatus);

    this.subSink.add(onlineEventsSub)
    this.subSink.add(offlineEventsSub)
  }

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
  }

  ngOnDestroy(): void {
    console.log('getting rid of online/offline subs in service')
    this.subSink.unsubscribe()
  }
}
