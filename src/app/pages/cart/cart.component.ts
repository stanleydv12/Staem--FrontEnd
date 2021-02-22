import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  user: any;
  cart: any = [];
  id: any;
  auth: any;
  total = 0;

  constructor(private apollo: Apollo, private route: Router) {}

  ngOnInit(): void {
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

  removeCart(gameid: string | undefined): void {
    const userid = this.user.id;
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($gameid: ID!, $userid: ID!) {
            deleteCartByGameId(input: { gameid: $gameid, userid: $userid }) {
              gameid
              userid
              game {
                id
                name
                price
              }
            }
          }
        `,
        variables: { gameid, userid },
      })
      .subscribe(({ data }) => {
        window.location.reload();
      });
  }

  triggerModal(gameid: any): void {
    let result = confirm('Are you sure want to delete this game?');
    if (result === true) {
      this.removeCart(gameid);
    }
  }

  purchase(msg: any): void {
    if (this.user.wallet > this.total) {
      let result = confirm(
        'You have enough wallet. Do you want to pay with your amount of wallet ?'
      );

      if (result === true) {
        this.user.wallet -= this.total;
        this.confirmGame(msg);
        this.user.updateUser();
        alert(this.user.wallet.toString + '$ left');
      } else {
        this.route.navigateByUrl('/payment/' + msg);
      }
    }
  }

  private getUser(): void {
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
        this.user = (data as any).getUserById;
        this.getCart(this.user.id.toString());
      });
  }

  private getCart(userid: string): void {
    this.apollo
      .query({
        query: gql`
          query asdf($userid: String!) {
            getCartById(input: $userid) {
              gameid
              userid
              game {
                id
                name
                price
                image
              }
            }
          }
        `,
        variables: { userid },
      })
      .subscribe(({ data }) => {
        this.cart = (data as any).getCartById;
        for (let c of this.cart) {
          this.total += c.game.price;
        }
        console.log(this.total);
        console.log(this.cart);
      });
  }

  private confirmGame(msg: any): void {
    if (msg === 'gift') {
    } else if (msg === 'self') {
      for (let g of this.cart) {
        this.apollo
          .mutate({
            mutation: gql`
              mutation adsfd($userid: ID!, $gameid: ID!) {
                insertGame(input: { userid: $userid, gameid: $gameid }) {
                  game {
                    id
                    name
                    genre
                  }
                }
              }
            `,
          })
          .subscribe(({ data }) => {});
      }
    }
  }
}
