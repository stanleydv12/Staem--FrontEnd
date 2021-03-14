import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  auth: boolean | undefined;
  id: string | undefined;
  user: any = {};
  countLanguage: any;
  dropdown: any;

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit(): void {
    this.dropdown = false;
    this.countLanguage = 1;
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
        this.user = (data as any).getUserById;
        console.log(this.user);
        console.log(data);
      });
  }

  requestLogOut(): void {
    localStorage.removeItem('jwt');
    this.router.navigateByUrl('/');
  }

  changeLanguage() {
    if (this.countLanguage === 2) {
      this.countLanguage = 1;
    } else {
      this.countLanguage = 2;
    }
  }
}
