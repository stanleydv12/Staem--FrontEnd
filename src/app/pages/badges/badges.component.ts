import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { subscribe } from 'graphql';

@Component({
  selector: 'app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss'],
})
export class BadgesComponent implements OnInit {
  private id: any;
  private auth: any;
  private userId: any;
  private loggedUser: any;
  private badges: any;
  private cards: any;
  private games: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router
  ) {}

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
      this.getUser();
    }
  }

  private getUser(): void {
    // alert(this.id);
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
        this.getBadges();
        this.getTradingCard();
        this.getGames();
      });
  }

  private getTradingCard() {
    this.apollo
      .query({
        query: gql`
          query asdf {
            getTradingCards {
              game_id
              id
              image
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.cards = (data as any).getBadges;
      });
  }

  private getBadges() {
    this.apollo
      .query({
        query: gql`
          query asdf {
            getBadges {
              game_id
              id
              image
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.badges = (data as any).getBadges;
      });
  }

  private getGames() {
    this.apollo
      .query({
        query: gql`
          query asdf {
            getGames {
              id
              name
              description
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.games = (data as any).getGames;
      });
  }
}
