// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/proxy.js';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

import { AppComponent } from './app/app.component';
import { NavbarComponent } from './app/components/components-nav/navbar/navbar.component';
import { HomeComponent } from './app/components/components-landing/home/home.component';
import { LoginComponent } from './app/components/components-user/login/login.component';
import { RegisterComponent } from './app/components/components-user/register/register.component';
import { ProfileComponent } from './app/components/components-user/profile/profile.component';
import { DashboardComponent } from './app/components/components-dashboard/dashboard/dashboard.component';
import { LandingLoginComponent } from './app/components/components-landing/landing-login/landing-login.component';
import { BottomBarComponent } from './app/components/components-nav/bottom-bar/bottom-bar.component';
import { GroupHomeComponent } from './app/components/components-groups/landing/group-home/group-home.component';
import { GroupAdminComponent } from './app/components/components-groups/admin/group-admin/group-admin.component';
import { AdminNavComponent } from './app/components/components-groups/admin/group-admin/admin-nav/admin-nav.component';
import { ChannelsMgmtComponent } from './app/components/components-groups/admin/group-admin/channels-mgmt/channels-mgmt.component';

// Unfortunately there's no typing for the `__karma__` variable. Just declare it as any.
declare var __karma__: any;
declare var require: any;

// Prevent Karma from running prematurely.
__karma__.loaded = function () {};

// First, initialize the Angular testing environment.
const testBed = getTestBed()

testBed.initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
testBed.configureTestingModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    DashboardComponent,
    LandingLoginComponent,
    BottomBarComponent,
    GroupHomeComponent,
    GroupAdminComponent,
    AdminNavComponent,
    ChannelsMgmtComponent
  ],
})
context.keys().map(context);


// Finally, start Karma to run the tests.
__karma__.start();
