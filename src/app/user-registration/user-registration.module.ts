import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { UserRegistrationComponent } from './user-registration.component';
import { UserRegistrationRoutingModule } from './user-registration-routing.module';
import { UserService } from '../services/user.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [UserRegistrationComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserRegistrationRoutingModule,
    HttpClientModule
  ],
  providers: [UserService]
})
export class UserRegistrationModule { }