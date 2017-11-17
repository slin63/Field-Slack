/* tslint:disable:no-unused-variable */
// https://angular.io/guide/testing#isolated-unit-tests
// https://blog.thoughtram.io/angular/2016/11/28/testing-services-with-http-in-angular-2.html

import { TestBed, async, inject } from '@angular/core/testing';
import { ChannelsService } from './channels.service';

import { HttpModule, Http, BaseRequestOptions, XHRBackend } from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { environment } from '../../environments/environment';
import { ResponseOptions } from '@angular/http/src/base_response_options';

describe('ChannelsService Isolated Unit Tests', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide : environment.api_url,
          useClass: MockBackend
        },
        ChannelsService
      ],
      imports: [HttpModule]
    })
  });

  it('should return an Observable<Channel>', inject([ChannelsService, XHRBackend], (service: ChannelsService, mockBackend: MockBackend) => {
    const mockResponse = {
      data: {
        channel: {
          _id: 'testID'
        }
      }
    }

    mockBackend.connections.subscribe((connection) => {
      connection.mockResponse(new Response(new ResponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });

    service.getChannelByID('testID').subscribe((channel) => {
      expect(channel).not.toBe(null);
      expect(channel._id).toEqual('testID');
    });
  }));
});

