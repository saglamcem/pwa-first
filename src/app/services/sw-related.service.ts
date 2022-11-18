import { CheckForUpdateService } from "./check-for-update.service";
import { HandleUnrecoverableStateService } from "./handle-unrecoverable-state.service";
import { PromptUpdateService } from "./prompt-update.service";
import { LogUpdateService } from "./log-update.service";
import { Injectable } from "@angular/core";

// only exists to group 4 different SW services and to trigger their constructors
@Injectable({providedIn: 'root'})
export class SwRelatedService {
  constructor(
    private readonly checkForUpdate: CheckForUpdateService,
    private readonly handleUnrecoverableState: HandleUnrecoverableStateService,
    private readonly promptUpdate: PromptUpdateService,
    private readonly logUpdate: LogUpdateService
  ) {
  }
}
