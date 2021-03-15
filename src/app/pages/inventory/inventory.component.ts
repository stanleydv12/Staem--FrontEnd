import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';
import { ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryComponent implements OnInit {
  id: any;
  auth: any;
  loggedUser: any;
  ownedGame: any;
  paginator: any;
  modal: any;
  selectedItem: any;
  chartData: ChartDataSets[] = [{ data: [], label: 'price' }];
  labelData: Label[] = [];
  tempCount: any;
  marketItems: any;
  selectedItemDetail: any;
  ownedGameItem: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.tempCount = 0;
    this.paginator = 1;
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
        this.getOwnedGame();
      });
  }

  getOwnedGame(): void {
    this.apollo
      .query({
        query: gql`
          query asdf($user_id: ID!, $current_page: Int!) {
            getOwnedGames(input: $user_id) {
              game {
                name
                image
                description
              }
              game_items(currentPage: $current_page) {
                game_item {
                  id
                  name
                  image
                  game {
                    name
                  }
                }
              }
            }
          }
        `,
        variables: { user_id: this.id, current_page: this.paginator },
      })
      .subscribe(({ data }) => {
        this.ownedGame = (data as any).getOwnedGames;
        console.log(this.ownedGame);
      });
  }

  prevItem() {
    this.paginator--;
    this.getOwnedGame();
  }

  nextItem() {
    this.paginator++;
    this.getOwnedGame();
  }

  setModal(gi: any) {
    this.selectedItem = gi;
    console.log(gi);
    this.getGameItemById();
    this.getMarketGameItem();
  }

  getGameItemById(): void {
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
        variables: { id: this.selectedItem.game_item.id },
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

  getMarketGameItem(): void {
    this.apollo
      .query({
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
        variables: { id: this.selectedItem.game_item.id },
      })
      .subscribe(({ data }) => {
        this.marketItems = (data as any).getMarketGameItemByID;
        this.modal = true;
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
}
