import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { ImageSliderComponent } from './components/image-slider/image-slider.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchbarComponent } from './components/searchbar/searchbar.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { PaymentComponent } from './pages/payment/payment.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CommunityComponent } from './pages/community/community.component';
import { EditprofileComponent } from './pages/editprofile/editprofile.component';
import { MarketComponent } from './pages/market/market.component';
import { MarketDetailComponent } from './pages/market-detail/market-detail.component';
import { FriendComponent } from './pages/friend/friend.component';
import { ChartsModule } from 'ng2-charts';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { TopUpComponent } from './top-up/top-up.component';
import { DiscoveryComponent } from './pages/discovery/discovery.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { PointsComponent } from './pages/points/points.component';
import { BadgesComponent } from './pages/badges/badges.component';
import { AdminManageGameComponent } from './pages/admin-manage-game/admin-manage-game.component';
import { AdminManagePromoComponent } from './pages/admin-manage-promo/admin-manage-promo.component';
import { AdminManageUserComponent } from './pages/admin-manage-user/admin-manage-user.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ChatDetailComponent } from './pages/chat-detail/chat-detail.component';
import { StreamComponent } from './pages/stream/stream.component';
import { BroadcastComponent } from './pages/broadcast/broadcast.component';
import { SearchComponent } from './pages/search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    RegisterComponent,
    LoginComponent,
    ImageSliderComponent,
    SearchbarComponent,
    GamePageComponent,
    CartComponent,
    WishlistComponent,
    PaymentComponent,
    ProfileComponent,
    CommunityComponent,
    EditprofileComponent,
    MarketComponent,
    MarketDetailComponent,
    FriendComponent,
    TopUpComponent,
    DiscoveryComponent,
    InventoryComponent,
    AdminLoginComponent,
    PointsComponent,
    BadgesComponent,
    AdminManageGameComponent,
    AdminManagePromoComponent,
    AdminManageUserComponent,
    ChatComponent,
    ChatDetailComponent,
    StreamComponent,
    BroadcastComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RecaptchaModule,
    GraphQLModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
  uri = 'https://48p1r2roz4.sse.codesandbox.io';
}
