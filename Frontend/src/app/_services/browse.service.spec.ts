import { TestBed, inject } from '@angular/core/testing';

import { BrowseService } from './browse.service';

describe('BrowseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrowseService]
    });
  });

  it('should be created', inject([BrowseService], (service: BrowseService) => {
    expect(service).toBeTruthy();
  }));
});
