import { TestBed } from '@angular/core/testing';

import { InternetConnectionService } from './internet-connection.service';

describe('ConnectionService', () => {
  let service: InternetConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InternetConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
