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

import { LocalService } from './services/local.service';
import { ValidateService } from './services/validate.service';
import { AuthService } from './services/auth.service';
import { UsergroupService } from './services/usergroup.service';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { BottomBarComponent } from './components/components-nav/bottom-bar/bottom-bar.component';
import { GroupHomeComponent } from './components/components-groups/landing/group-home/group-home.component';

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
    path: '/groups/:user_group_code', component: GroupHomeComponent,
    canActivate: [AuthGuard]
  },
  
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
    GroupHomeComponent
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
    UsergroupService
   ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
