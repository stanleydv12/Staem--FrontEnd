import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  user: any;
  wishlist: any = [];
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

  addToCart(gameid: any, userid: any): void {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($gameid: ID!, $userid: ID!) {
            inputCart(input: { gameid: $gameid, userid: $userid }) {
              game {
                id
              }
              gameid
              userid
            }
          }
        `,
        variables: { gameid, userid },
      })
      .subscribe(({ data }) => {
        alert('Success add to cart !');
      });
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
        this.getWishlist(this.user.id.toString());
      });
  }

  private getWishlist(userid: any): void {
    this.apollo
      .query({
        query: gql`
          query asdf($userid: String!) {
            getWishlists(input: $userid) {
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
        this.wishlist = (data as any).getWishlists;
        console.log(this.wishlist);
      });
  }

  removeWishlist(gameid: any, userid: any): void {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($gameid: ID!, $userid: ID!) {
            deleteWishlist(input: { gameid: $gameid, userid: $userid }) {
              id
            }
          }
        `,
        variables: { gameid, userid },
      })
      .subscribe(({ data }) => {
        window.location.reload();
      });
  }
}
