import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-up',
  templateUrl: './top-up.component.html',
  styleUrls: ['./top-up.component.scss'],
})
export class TopUpComponent implements OnInit {
  id: any;
  auth: any;
  private user: any;
  code: string = '';
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
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
    }
  }

  checkTopUp() {
    console.log(this.code);
    if (!this.auth) {
      return;
    }
    this.apollo
      .query({
        query: gql`
          query asdf($code: String, $user_id: ID!) {
            checkWallet(input: { code: $code, user_id: $user_id })
          }
        `,
        variables: { code: this.code, user_id: this.id },
      })
      .subscribe(({ data }) => {
        // @ts-ignore
        if (data.checkWallet) alert('Top Up Success');
        else alert('Wrong Code');
      });
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
        this.user = (data as any).getUserById;
      });
  }
}
