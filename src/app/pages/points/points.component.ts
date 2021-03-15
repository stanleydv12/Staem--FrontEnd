import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-points',
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.scss'],
})
export class PointsComponent implements OnInit {
  avatars: any;
  avatarBorders: any;
  profileBackgrounds: any;
  miniProfileBackgrounds: any;
  chatStickers: any;
  id: any;
  auth: any;
  loggedUser: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getPointShopItem();
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
              point
            }
          }
        `,
        variables: { id },
      })
      .subscribe(({ data }) => {
        this.loggedUser = (data as any).getUserById;
      });
  }

  getPointShopItem() {
    this.apollo
      .query({
        query: gql`
          query asdf {
            getAvatar {
              id
              path
              price
            }
            getAvatarBorder {
              id
              path
              price
            }
            getProfileBackground {
              id
              path
              price
            }
            getMiniProfileBackground {
              id
              path
              price
            }
            getChatSticker {
              id
              path
              price
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.avatars = (data as any).getAvatar;
        this.avatarBorders = (data as any).getAvatarBorder;
        this.profileBackgrounds = (data as any).getProfileBackground;
        this.miniProfileBackgrounds = (data as any).getMiniProfileBackground;
        this.chatStickers = (data as any).getChatSticker;
      });
  }

  buyAvatar(i: any, type: string) {
    if (!this.auth) {
      return;
    }
    let confirm: any;
    confirm = window.confirm('Are you sure want to buy this item ? ');
    if (!confirm) return;
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($user_id: ID!, $item_id: ID!, $type: String!) {
            buyItemAtPointShop(
              user_id: $user_id
              item_id: $item_id
              type: $type
            )
          }
        `,
        variables: { user_id: this.id, item_id: i.id, type: type },
      })
      .subscribe(({ data }) => {
        this.reducePoint(this.loggedUser.id, i.price);
      });
  }

  buyProfile(i: any, type: string) {
    if (!this.auth) {
      return;
    }
    let confirm: any;
    confirm = window.confirm('Are you sure want to buy this item ? ');
    if (!confirm) return;
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($user_id: ID!, $item_id: ID!, $type: String!) {
            buyItemAtPointShop(
              user_id: $user_id
              item_id: $item_id
              type: $type
            )
          }
        `,
        variables: { user_id: this.id, item_id: i.id, type: type },
      })
      .subscribe(({ data }) => {
        this.reducePoint(this.loggedUser.id, i.price);
      });
  }

  buyMiniProfile(i: any, type: string) {
    if (!this.auth) {
      return;
    }
    let confirm: any;
    confirm = window.confirm('Are you sure want to buy this item ? ');
    if (!confirm) return;
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($user_id: ID!, $item_id: ID!, $type: String!) {
            buyItemAtPointShop(
              user_id: $user_id
              item_id: $item_id
              type: $type
            )
          }
        `,
        variables: { user_id: this.id, item_id: i.id, type: type },
      })
      .subscribe(({ data }) => {
        this.reducePoint(this.loggedUser.id, i.price);
      });
  }

  buyChatSticker(i: any, type: string) {
    if (!this.auth) {
      return;
    }
    let confirm: any;
    confirm = window.confirm('Are you sure want to buy this item ? ');
    if (!confirm) return;
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($user_id: ID!, $item_id: ID!, $type: String!) {
            buyItemAtPointShop(
              user_id: $user_id
              item_id: $item_id
              type: $type
            )
          }
        `,
        variables: { user_id: this.id, item_id: i.id, type: type },
      })
      .subscribe(({ data }) => {
        this.reducePoint(this.loggedUser.id, i.price);
      });
  }

  buyAvatarBorder(i: any, type: string) {
    if (!this.auth) {
      return;
    }
    let confirm: any;
    confirm = window.confirm('Are you sure want to buy this item ? ');
    if (!confirm) return;
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($user_id: ID!, $item_id: ID!, $type: String!) {
            buyItemAtPointShop(
              user_id: $user_id
              item_id: $item_id
              type: $type
            )
          }
        `,
        variables: { user_id: this.id, item_id: i.id, type: type },
      })
      .subscribe(({ data }) => {
        this.reducePoint(this.loggedUser.id, i.price);
      });
  }

  reducePoint(id: any, price: any): void {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($user_id: ID!, $price: Int!) {
            reducePoint(user_id: $user_id, price: $price) {
              name
              point
            }
          }
        `,
        variables: { user_id: id, price: price },
      })
      .subscribe();
  }
}
