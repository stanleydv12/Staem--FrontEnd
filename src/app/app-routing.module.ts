import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { CommonModule } from '@angular/common';
import { RecaptchaModule } from 'ng-recaptcha';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { AuthGuard } from './guards/auth.guard';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { CommunityComponent } from './pages/community/community.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditprofileComponent } from './pages/editprofile/editprofile.component';
import { MarketComponent } from './pages/market/market.component';
import { MarketDetailComponent } from './pages/market-detail/market-detail.component';
import { FriendComponent } from './pages/friend/friend.component';
import { TopUpComponent } from './top-up/top-up.component';
import { DiscoveryComponent } from './pages/discovery/discovery.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { PointsComponent } from './pages/points/points.component';
import { AdminManageGameComponent } from './pages/admin-manage-game/admin-manage-game.component';
import { AdminManagePromoComponent } from './pages/admin-manage-promo/admin-manage-promo.component';
import { AdminManageUserComponent } from './pages/admin-manage-user/admin-manage-user.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatDetailComponent } from './pages/chat-detail/chat-detail.component';

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
  {
    path: 'community',
    component: CommunityComponent,
  },
  {
    path: 'profile/:id',
    component: ProfileComponent,
  },
  {
    path: 'editprofile/:id',
    component: EditprofileComponent,
  },
  {
    path: 'market',
    component: MarketComponent,
  },
  {
    path: 'market/item/:id',
    component: MarketDetailComponent,
  },
  {
    path: 'friend',
    component: FriendComponent,
  },
  {
    path: 'top-up',
    component: TopUpComponent,
  },
  {
    path: 'discovery',
    component: DiscoveryComponent,
  },
  {
    path: 'inventory',
    component: InventoryComponent,
  },
  {
    path: 'admin-login',
    component: AdminLoginComponent,
  },
  {
    path: 'points',
    component: PointsComponent,
  },
  {
    path: 'admin-manage/game',
    component: AdminManageGameComponent,
  },
  {
    path: 'admin-manage/promo',
    component: AdminManagePromoComponent,
  },
  {
    path: 'admin-manage/user',
    component: AdminManageUserComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
  },
  {
    path: 'chat/:id',
    component: ChatDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), RecaptchaModule, CommonModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
