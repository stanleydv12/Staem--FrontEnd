import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-manage-game',
  templateUrl: './admin-manage-game.component.html',
  styleUrls: ['./admin-manage-game.component.scss'],
})
export class AdminManageGameComponent implements OnInit {
  id: any;
  auth: any;
  loggedUser: any;
  allGames: any;
  paginator: any;

  insertGameForm = this.fb.group({
    game_id: ['', Validators.required],
    name: ['', Validators.required],
    genre: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    tag: ['', Validators.required],
    image: ['', Validators.required],
    about: ['', Validators.required],
    mature: null,
  });

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
            getAllGames(paginator: $paginator) {
              id
              image
              name
            }
          }
        `,
        variables: { paginator: this.paginator },
      })
      .subscribe(({ data }) => {
        this.allGames = (data as any).getAllGames;
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
    var mature: any;
    if (this.insertGameForm.get('mature')?.value == true) {
      mature = 'True';
    } else mature = 'False';
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf(
            $name: String!
            $genre: String!
            $price: Int!
            $desc: String!
            $tag: String!
            $image: String!
            $about: String!
            $mature: String!
          ) {
            addNewGame(
              input: {
                name: $name
                genre: $genre
                image: $image
                price: $price
                description: $desc
                mature: $mature
                about: $about
                tag: $tag
              }
            ) {
              id
            }
          }
        `,
        variables: {
          name: this.insertGameForm.get('name')?.value,
          genre: this.insertGameForm.get('genre')?.value,
          image: this.insertGameForm.get('image')?.value,
          price: this.insertGameForm.get('price')?.value,
          desc: this.insertGameForm.get('description')?.value,
          mature: mature,
          about: this.insertGameForm.get('about')?.value,
          tag: this.insertGameForm.get('tag')?.value,
        },
      })
      .subscribe(({ data }) => {
        alert('Success Add a game');
      });
  }

  updateGame() {
    var mature: any;
    if (this.insertGameForm.get('mature')?.value == true) {
      mature = 'True';
    } else mature = 'False';

    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf(
            $id: ID!
            $name: String!
            $genre: String!
            $price: Int!
            $desc: String!
            $tag: String!
            $image: String!
            $about: String!
            $mature: String!
          ) {
            updateGame(
              input: {
                id: $id
                name: $name
                genre: $genre
                image: $image
                price: $price
                description: $desc
                mature: $mature
                about: $about
                tag: $tag
              }
            ) {
              id
            }
          }
        `,
        variables: {
          id: this.insertGameForm.get('game_id')?.value,
          name: this.insertGameForm.get('name')?.value,
          genre: this.insertGameForm.get('genre')?.value,
          image: this.insertGameForm.get('image')?.value,
          price: this.insertGameForm.get('price')?.value,
          desc: this.insertGameForm.get('description')?.value,
          mature: mature,
          about: this.insertGameForm.get('about')?.value,
          tag: this.insertGameForm.get('tag')?.value,
        },
      })
      .subscribe(({ data }) => {
        alert('Success Update a game');
      });
  }

  deleteGame() {
    let confirm = window.confirm('Are you sure want to delete this game ?');
    if (!confirm) return;
    this.apollo
      .mutate({
        mutation: gql`
          query asdf($id: ID!) {
            deleteGame(game_id: $id) {
              id
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
