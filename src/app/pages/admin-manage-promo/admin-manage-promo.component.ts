import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-admin-manage-promo',
  templateUrl: './admin-manage-promo.component.html',
  styleUrls: ['./admin-manage-promo.component.scss'],
})
export class AdminManagePromoComponent implements OnInit {
  id: any;
  auth: any;
  loggedUser: any;
  allGames: any;
  paginator: any;

  insertGameForm = this.fb.group({
    game_id: ['', Validators.required],
    amount: ['', Validators.required],
  });
  promoGames: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
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
        if (this.loggedUser.email !== 'admin@admin.com')
          this.router.navigateByUrl('home');
        this.allGame();
      });
  }

  allGame(): void {
    this.apollo
      .query({
        query: gql`
          query asdf($paginator: Int!) {
            getAllPromo(paginator: $paginator) {
              amount
              game {
                id
                image
                name
              }
              game_id
            }
            getGames {
              id
              name
            }
          }
        `,
        variables: { paginator: this.paginator },
      })
      .subscribe(({ data }) => {
        this.allGames = (data as any).getAllPromo;
        this.promoGames = (data as any).getGames;
      });
  }

  nextPage() {
    this.paginator++;
    this.allGame();
  }

  prevPage() {
    this.paginator--;
    this.allGame();
  }

  addGame() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($amount: Int!, $id: ID!) {
            addNewPromo(input: { amount: $amount, id: $id }) {
              game_id
            }
          }
        `,
        variables: {
          amount: this.insertGameForm.get('amount')?.value,
          id: this.insertGameForm.get('game_id')?.value,
        },
      })
      .subscribe(({ data }) => {
        alert('Success Add a promo');
      });
  }

  updateGame() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($amount: Int!, $id: ID!) {
            updatePromo(input: { amount: $amount, id: $id }) {
              game_id
            }
          }
        `,
        variables: {
          amount: this.insertGameForm.get('amount')?.value,
          id: this.insertGameForm.get('game_id')?.value,
        },
      })
      .subscribe(({ data }) => {
        alert('Success update a promo');
      });
  }

  deleteGame() {
    let confirm = window.confirm('Are you sure want to delete this promo ?');
    if (!confirm) return;
    this.apollo
      .mutate({
        mutation: gql`
          query asdf($id: ID!) {
            deletePromo(promo_id: $id) {
              game_id
            }
          }
        `,
        variables: { id: this.insertGameForm.get('game_id')?.value },
      })
      .subscribe(({ data }) => {
        alert('Success Delete a game');
      });
  }
}
