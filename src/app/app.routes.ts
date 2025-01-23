import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { SingleHomeComponent } from './single-home/single-home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { authGuard } from './services/auth.guard';
import { AllUsersComponent } from './all-users/all-users.component';
import { AddNewUsersComponent } from './add-new-users/add-new-users.component';
import { UpdateUsersComponent } from './update-users/update-users.component';
import { EventsAdminComponent } from './events-admin/events-admin.component';
import { EventMemberComponent } from './event-member/event-member.component';
import { LayoutMemberComponent } from './layout-member/layout-member.component';
import { AllHorsesComponent } from './all-horses/all-horses.component';
import { ManageHorsesComponent } from './manage-horses/manage-horses.component';
import { BookingComponent } from './booking/booking.component';
import { TrainingAdminComponent } from './training-admin/training-admin.component';
import { AddNewTrainingComponent } from './add-new-training/add-new-training.component';
import { TrainingComponent } from './training/training.component';
import { HorsesComponent } from './horses/horses.component';
import { PricingComponent } from './pricing/pricing.component';
import { PaymentComponent } from './payment/payment.component';
import { StripeCancelComponent } from './stripe-cancel/stripe-cancel.component';
import { StripeSuccessComponent } from './stripe-success/stripe-success.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/HomeSingle',
    pathMatch: 'full',
  },
  {
    path: 'HomeSingle',
    component: SingleHomeComponent,
  },
  {
    path: 'loginMember',
    component: LoginComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'loginAdmin',
    component: LoginAdminComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },

  // Admin Dashboard Routes
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'all-users',
        component: AllUsersComponent,
      },
      {
        path: 'add-new-users',
        component: AddNewUsersComponent,
      },
      {
        path: 'update-users',
        component: UpdateUsersComponent,
      },
      {
        path: 'manage-events',
        component: EventsAdminComponent,
      },
      {
        path: 'all-horses',
        component: AllHorsesComponent,
      },
      {
        path: 'add-new-horses',
        component: ManageHorsesComponent,
      },
      {
        path: 'bookings',
        component: BookingComponent,
      },
      {
        path: 'training',
        component: TrainingAdminComponent,
      },
      {
        path: 'add-new-training',
        component: AddNewTrainingComponent,
      },
    ],
  },

  // Layout Member Routes
  {
    path: 'layout',
    component: LayoutMemberComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'events',
        component: EventMemberComponent,
      },
      {
        path: 'training',
        component: TrainingComponent,
      },
      {
        path: 'horses',
        component: HorsesComponent,
      },
      {
        path: 'pricing',
        component: PaymentComponent,
      },
      {
        path: 'stripe-successful-payment',
        component: StripeSuccessComponent,
      },
      {
        path: 'payment-cancel',
        component: StripeCancelComponent,
      },
    ],
  },
  {
    path: 'training',
    redirectTo: '/layout/training',
    pathMatch: 'full',
  },
];
