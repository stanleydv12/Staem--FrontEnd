import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  id: any;
  auth: any;
  userId: any;
  myProfile: any;
  user: any;

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
          if (this.id === this.userId) {
            this.myProfile = true;
            this.getUser();
          }
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
              border
              summary
              friend_request {
                friend {
                  id
                  name
                  image
                  country
                  status
                }
              }
              friends {
                friend {
                  id
                  name
                  image
                  country
                  status
                }
              }
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
}
