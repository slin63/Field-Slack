/* tslint:disable:no-unused-variable */
// https://angular.io/guide/testing#isolated-unit-tests

import { TestBed, async, inject } from '@angular/core/testing';
import { ChannelsService } from './channels.service';

describe('ChannelsService Isolated Unit Tests', () => {
  let service: ChannelsService;

  beforeEach(() => {
    service = new ChannelsService();
  });

  it('testFunction should return true', (done: DoneFn) => {
    const testFunctionRes = service.testFunction()
    expect(testFunctionRes).toBe(true);
    done();
    });
  });

