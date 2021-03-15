import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-market-detail',
  templateUrl: './market-detail.component.html',
  styleUrls: ['./market-detail.component.scss'],
})
export class MarketDetailComponent implements OnInit {
  itemParam: any;
  selectedItemDetail: any;
  marketItems: any;
  auth: any;
  id: any;
  loggedUser: any;
  ownedGameItem: any;
  recentActivity: any;
  chartData: ChartDataSets[] = [{ data: [], label: 'price' }];
  labelData: Label[] = [];
  tempCount: any = 0;
  marketListing: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.itemParam = this.activatedRoute.snapshot.paramMap.get('id');
    this.getGameItemById(this.itemParam);
    this.getMarketGameItem();
    this.apollo
      .subscribe({
        query: gql`
          subscription asdf($item_id: Int!) {
            messageAdded(itemID: $item_id)
          }
        `,
        variables: { item_id: this.itemParam },
      })
      .subscribe(({ data }) => {
        this.recentActivity = (data as any).messageAdded;
      });

    if (localStorage.getItem('jwt')) {
      const token: string | null = localStorage.getItem('jwt');
      this.apollo
        .query<{ auth: number }>({
          query: gql`
            query asdf($token: String!) {
              auth(input: $token)
            }
          `,
          variables: { token },
        })
        .subscribe(({ data }) => {
          this.id = data.auth.toString();
          this.auth = true;
          this.getUser();
        });
    } else {
      this.auth = false;
    }
  }

  getUser(): void {
    const id = this.id;
    this.apollo
      .query<{ user: any }>({
        query: gql`
          query asdf($id: ID!) {
            getUserById(input: $id) {
              id
              name
              email
              password
              country
              wallet
              image
            }
          }
        `,
        variables: { id },
      })
      .subscribe(({ data }) => {
        this.loggedUser = (data as any).getUserById;
        this.getMarketListing();
      });
  }

  getGameItemById(itemParam: any): void {
    this.apollo
      .query({
        query: gql`
          query asdf($id: ID!) {
            getGameItemByID(input: $id) {
              game {
                id
                image
                name
              }
              transactions {
                createdAt
                game_item_id
                price
              }
              game_id
              id
              image
              name
            }
          }
        `,
        variables: { id: itemParam },
      })
      .subscribe(({ data }) => {
        this.selectedItemDetail = (data as any).getGameItemByID;
        // @ts-ignore
        this.selectedItemDetail.transactions.forEach((data) => {
          // @ts-ignore
          this.chartData[0].data.push(data.price);
          this.labelData.push(data.createdAt);
        });
      });
  }

  getMarketGameItem(): void {
    this.apollo
      .watchQuery({
        query: gql`
          query asdf($id: ID!) {
            getMarketGameItemByID(input: $id) {
              game_item {
                game_id
                id
                image
                name
              }
              price
              type
              user {
                id
                name
              }
            }
          }
        `,
        variables: { id: this.itemParam },
        pollInterval: 5000,
      })
      .valueChanges.subscribe(({ data }) => {
        this.marketItems = (data as any).getMarketGameItemByID;
      });
  }

  buyItem(): void {
    const temp = window.prompt('Please Input Bid Price');
    let price = 0;
    let found = false;
    let foundItem: any;
    let buyerid = this.loggedUser.id;
    if (temp != null) {
      price = parseInt(temp);
    }

    // @ts-ignore
    if (this.loggedUser.wallet - price >= 0) {
      this.marketItems.forEach(function (m: {
        price: number;
        type: string;
        user_id: any;
      }) {
        if (m.price === price && m.type === 'offer') {
          found = true;
          foundItem = m;
        }
      });

      if (found) {
        // @ts-ignore
        this.addUserWallet(foundItem.user.id, price);
        // @ts-ignore
        this.reduceUserWallet(this.loggedUser.id, price);
        this.apollo
          .mutate({
            mutation: gql`
              mutation asdf($user_id: ID!, $game_item_id: ID!, $buyer_id: ID!) {
                boughtGameItem(
                  input: {
                    user_id: $user_id
                    game_item_id: $game_item_id
                    buyer_id: $buyer_id
                  }
                ) {
                  game_item_id
                  user_id
                }
              }
            `,
            variables: {
              user_id: foundItem.user.id,
              game_item_id: foundItem.game_item.id,
              buyer_id: this.loggedUser.id,
            },
          })
          .subscribe(({ data }) => {
            this.getMarketGameItem();
            alert('Successfully Bought');
          });
      } else {
        this.insertMarketGameItem(
          this.loggedUser.id,
          this.selectedItemDetail.id,
          'bid',
          price
        );
      }
    }
  }

  sellItem(): void {
    const temp = window.prompt('Please Input Offer Price');
    let price = 0;
    let found = false;
    let foundItem: any;
    let buyerid = this.loggedUser.id;
    if (temp != null) {
      price = parseInt(temp);
    }

    // @ts-ignore
    if (this.loggedUser.wallet - price >= 0) {
      this.marketItems.forEach(function (m: {
        price: number;
        type: string;
        user_id: any;
      }) {
        if (m.price === price && m.type === 'bid') {
          found = true;
          foundItem = m;
        }
      });

      if (found) {
        this.checkOwnedItem(this.loggedUser.id, foundItem.game_item.id);
        // @ts-ignore
        this.reduceUserWallet(foundItem.user.id, price);
        // @ts-ignore
        this.addUserWallet(this.loggedUser.id, price);
        this.apollo
          .mutate({
            mutation: gql`
              mutation asdf(
                $user_id: ID!
                $game_item_id: ID!
                $seller_id: ID!
              ) {
                soldGameItem(
                  input: {
                    user_id: $user_id
                    game_item_id: $game_item_id
                    buyer_id: $seller_id
                  }
                ) {
                  game_item_id
                  user_id
                }
              }
            `,
            variables: {
              user_id: foundItem.user.id,
              game_item_id: foundItem.game_item.id,
              seller_id: this.loggedUser.id,
            },
          })
          .subscribe(({ data }) => {
            this.getMarketGameItem();
            this.tempCount = 0;
            alert('Successfully Sold');
          });
      } else {
        this.insertMarketGameItem(
          this.loggedUser.id,
          this.selectedItemDetail.id,
          'offer',
          price
        );
      }
    }
  }

  updateUser(price: any): void {
    this.apollo
      .mutate({
        mutation: gql`
          mutation adsfd(
            $id: ID!
            $name: String!
            $email: String!
            $password: String!
            $wallet: Float!
            $image: String!
            $country: String!
          ) {
            updateUser(
              input: {
                id: $id
                name: $name
                email: $email
                password: $password
                wallet: $wallet
                image: $image
                country: $country
              }
            ) {
              id
              name
              email
              password
              country
              wallet
              image
            }
          }
        `,
        variables: {
          id: this.loggedUser.id,
          name: this.loggedUser.name,
          email: this.loggedUser.email,
          password: this.loggedUser.password,
          wallet: this.loggedUser.wallet - price,
          image: this.loggedUser.image,
          country: this.loggedUser.country,
        },
      })
      .subscribe(({ data }) => {});
  }

  addUserWallet(id: any, price: any): void {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($user_id: ID!, $price: Float!) {
            addUserWallet(input: { user_id: $user_id, wallet: $price }) {
              name
              wallet
            }
          }
        `,
        variables: { user_id: id, price: price },
      })
      .subscribe();
  }

  reduceUserWallet(id: any, price: any): void {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($user_id: ID!, $price: Float!) {
            reduceUserWallet(input: { user_id: $user_id, wallet: $price }) {
              name
              wallet
            }
          }
        `,
        variables: { user_id: id, price: price },
      })
      .subscribe();
  }

  checkOwnedItem(user_id: any, game_item_id: any): void {
    this.apollo
      .query({
        query: gql`
          query asdf($user_id: ID!, $game_item_id: ID!) {
            checkOwnedGameItem(
              input: { user_id: $user_id, game_item_id: $game_item_id }
            )
          }
        `,
        variables: { user_id: user_id, game_item_id },
      })
      .subscribe(({ data }) => {
        this.tempCount++;
        this.ownedGameItem = (data as any).checkOwnedGameItem;
        if (this.ownedGameItem && this.tempCount === 1) this.sellItem();
      });
  }

  insertMarketGameItem(user_id: any, game_item_id: any, bid: any, price: any) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf(
            $user_id: ID!
            $game_item_id: ID!
            $type: String!
            $price: Int!
          ) {
            addMarketGameItem(
              input: {
                user_id: $user_id
                game_item_id: $game_item_id
                type: $type
                price: $price
              }
            ) {
              game_item_id
              user_id
            }
          }
        `,
        variables: {
          user_id: user_id,
          game_item_id: game_item_id,
          type: bid,
          price: price,
        },
      })
      .subscribe();
  }

  getMarketListing(): void {
    console.log(this.loggedUser);
    this.apollo
      .query({
        query: gql`
          query asdf($user_id: ID!, $game_item_id: ID!) {
            getMarketListing(
              input: { game_item_id: $game_item_id, user_id: $user_id }
            ) {
              game_item_id
              game_item {
                game_id
                name
              }
              price
              type
              user {
                name
              }
              user_id
            }
          }
        `,
        variables: {
          user_id: this.loggedUser.id,
          game_item_id: this.itemParam,
        },
      })
      .subscribe(({ data }) => {
        this.marketListing = (data as any).getMarketListing;
        console.log(this.marketListing);
      });
  }
}
