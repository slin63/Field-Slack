/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LandingLoginComponent } from './landing-login.component';

describe('LandingLoginComponent', () => {
  let component: LandingLoginComponent;
  let fixture: ComponentFixture<LandingLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandingLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
