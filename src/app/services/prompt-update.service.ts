import {filter} from "rxjs";
import {Injectable} from "@angular/core";
import {SwUpdate, VersionReadyEvent} from "@angular/service-worker";

@Injectable({providedIn: 'root'})
export class PromptUpdateService {

  constructor(swUpdate: SwUpdate) {
    swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(evt => {
        console.log(evt)
        if (confirm('There is a newer version of this app. Would you like to update it?')) {
          // Reload the page to update to the latest version.
          document.location.reload();
        }
      });
  }

}
