/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UsergroupService } from './usergroup.service';

import { HttpModule } from '@angular/http';

describe('UsergroupService tests', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsergroupService],
      imports: [HttpModule]
    });
  });

  it('should load', inject([UsergroupService], (service: UsergroupService) => {
    expect(service).toBeTruthy();
  }));
});
