import {Inject, Injectable} from "@angular/core";
import {WINDOW} from "../tokens/global";
import {Observable, Subject, tap} from "rxjs";
import {SwPush} from "@angular/service-worker";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class NotificationService {
  private readonly subValues$$: Subject<object> = new Subject<object>();
  readonly subValues$: Observable<object> = this.subValues$$.asObservable();

  constructor(
    @Inject(WINDOW) private readonly window: Window,
    private readonly swPush: SwPush
  ) {
  }

  async requestPermissionIfNeeded(): Promise<boolean> {
    if ('Notification' in window) {
      // ask even if denied, solely for testing/debugging purposes
      // don't be annoying

      if (Notification.permission === 'granted') return true;

      try {
        const permissionResponse = await Notification.requestPermission();
        return permissionResponse === 'granted';
      }
      catch (err) {
        console.error('Request permission failed')
        console.error(err);
        return false;
      }
    }
    else {
      console.warn('Notifications are not supported by the client')
      alert('Notifications are not supported by the client')
      this.createBasicNotification('Notifications are not supported by the client')
      return false;
    }
  }

  createBasicNotification(title: string, options: NotificationOptions = {}) {
    const notification = new Notification(title, {...options})

    console.log("notification")
    console.log(notification)
  }

  pushSubscription(): void {
    if (!this.swPush.isEnabled) {
      console.warn('SwPush is NOT enabled');
      this.subValues$$.next({problem: 'Swpush is NOT enabled'})
      return;
    }

    // for what should happen when user clicks a push notification bubble
    this.swPush.notificationClicks
      ?.pipe(
        tap(({notification, action}) => {
          console.log('this.swPush.notificationClicks')
          console.log(notification)
          console.log(action)

          // for debugging:
          // this.subValues$$.next({url: notification?.data?.url ?? 'value doesnt exist'})

          // fixme: on mobile popup was blocked. gentle way to ask for popup/redirect permission?
          // todo: investigate
          window.open(notification.data.url)
        })
      )
      .subscribe()

    // for push notification messages
    this.swPush.messages
      ?.pipe(
        tap(val => {
          console.log('this.swPush.messages')
          console.log(val)
        })
      )
      .subscribe()

    this.swPush.requestSubscription({
      serverPublicKey: environment.serverPublicKey
    })
      .then(val => {
        console.log('this.swPush.requestSubscription')
        console.log(JSON.stringify(val, null, 2))
        this.subValues$$.next(val);
      })
      .catch(err => console.error(err))
  }
}
