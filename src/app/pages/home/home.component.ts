import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  name: string | undefined;
  loading: boolean | undefined;
  userId = 1;
  user: any = {};

  featuredGame: any = [];

  constructor(private apollo: Apollo) {}

  showName(): void {
    this.apollo
      .query<any>({
        query: gql`
          query getUser {
            users {
              name
              id
              email
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.user = data.users;
        console.log(this.user);
      });
  }

  print(x: number): void {
    console.log(x);
  }

  getGameByFeatured(): void {
    const tag = 'Featured';
    this.apollo
      .query({
        query: gql`
          query adsfd($tag: String!) {
            getGameByTag(input: $tag) {
              id
              name
              genre
              price
              description
              tag
              banner
              image
            }
          }
        `,
        variables: { tag },
      })
      .subscribe(({ data }) => {
        this.featuredGame = (data as any).getGameByTag;
        console.log(this.featuredGame);
      });
  }

  ngOnInit(): void {
    this.getGameByFeatured();
  }
}
