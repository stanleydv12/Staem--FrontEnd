import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';
import { ImageSliderComponent } from './components/image-slider/image-slider.component';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { AuthGuard } from './guards/auth.guard';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { PaymentComponent } from './pages/payment/payment.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'searchbar',
    component: SearchbarComponent,
  },
  {
    path: 'game-page/:id',
    component: GamePageComponent,
  },
  {
    path: 'cart',
    component: CartComponent,
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
  },
  {
    path: 'payment/:msg',
    component: PaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), RecaptchaModule, CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
