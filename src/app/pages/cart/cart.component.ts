import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  user: any;
  cart: any;
  id: any;
  auth: any;

  constructor(private apollo: Apollo) {}

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
        this.getCart(this.id);
      });
  }

  private getCart(id: string): void {
    this.apollo
      .query({
        query: gql`
          query asdf($userid: String!) {
            getCartById(input: $userid) {
              id
              gameid
              userid
              game {
                name
                price
                image
              }
            }
          }
        `,
        variables: { userid: id },
      })
      .subscribe(({ data }) => {
        this.cart = (data as any).getCartById;
      });
  }

  removeCart(gameid: string | undefined) {
    this.apollo.mutate({
      mutation: gql``,
    });
  }
}
