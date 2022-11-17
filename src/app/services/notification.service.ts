import {Inject, Injectable} from "@angular/core";
import {WINDOW} from "../tokens/global";

@Injectable({providedIn: 'root'})
export class NotificationService {
  constructor(@Inject(WINDOW) private readonly window: Window) {
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
      return false;
    }
  }

  createBasicNotification(title: string, options: NotificationOptions) {
    const notification = new Notification(title, {...options})

    console.log("notification")
    console.log(notification)
  }
}
