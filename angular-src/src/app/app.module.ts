import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { NavbarComponent } from './components/components-nav/navbar/navbar.component';
import { HomeComponent } from './components/components-landing/home/home.component';
import { LoginComponent } from './components/components-user/login/login.component';
import { RegisterComponent } from './components/components-user/register/register.component';
import { ProfileComponent } from './components/components-user/profile/profile.component';
import { DashboardComponent } from './components/components-dashboard/dashboard/dashboard.component';
import { LandingLoginComponent } from './components/components-landing/landing-login/landing-login.component';
import { BottomBarComponent } from './components/components-nav/bottom-bar/bottom-bar.component';
import { GroupHomeComponent } from './components/components-groups/landing/group-home/group-home.component';
import { GroupAdminComponent } from './components/components-groups/admin/group-admin/group-admin.component';
import { AdminNavComponent } from './components/components-groups/admin/group-admin/admin-nav/admin-nav.component';
import { ChannelsMgmtComponent } from './components/components-groups/admin/group-admin/channels-mgmt/channels-mgmt.component';
import { ChatComponent } from './components/components-groups/chat/chat/chat.component';

import { LocalService } from './services/local.service';
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { UsergroupService } from './services/usergroup.service';
import { ChannelsService } from './services/channels.service';
import { ChatService } from './services/chat.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
  {
    path: '', component: HomeComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'dashboard', component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile', component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'groups/:user_group_code', component: GroupHomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'groups/:user_group_code/:user_group/admin', component: GroupAdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'channels',
        component: ChannelsMgmtComponent,
        canActivate: [AuthGuard],
        outlet: 'sub'
      }
    ]
  }
]

@NgModule({
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
    ChannelsMgmtComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule
  ],
  providers: [
    ValidateService,
    AuthService,
    AuthGuard,
    LocalService,
    UsergroupService,
    ChannelsService,
    ChatService
   ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
