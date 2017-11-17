/* tslint:disable:no-unused-variable */
// https://angular.io/guide/testing#isolated-unit-tests

import { TestBed, async, inject } from '@angular/core/testing';
import { ChannelsService } from './channels.service';

import { HttpModule } from '@angular/http';

describe('ChannelsService Isolated Unit Tests', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChannelsService],
      imports: [HttpModule]
    })
  });

  it('testFunction should return true', inject([ChannelsService], (service: ChannelsService) => {
    const testFunctionRes = service.testFunction()
    expect(testFunctionRes).toBe(true);
      }
    )
  );
});
