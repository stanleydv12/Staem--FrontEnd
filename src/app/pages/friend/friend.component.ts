import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss'],
})
export class FriendComponent implements OnInit {
  loggedUser: any;
  id: any;
  auth: any;
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
              badge
              friend_request {
                friend {
                  id
                  name
                  image
                  status
                  summary
                }
              }
              friends {
                friend {
                  id
                  name
                  image
                  status
                  summary
                }
              }
            }
          }
        `,
        variables: { id },
      })
      .subscribe(({ data }) => {
        this.loggedUser = (data as any).getUserById;
        console.log(this.loggedUser);
      });
  }

  addFriend(p: any): void {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($friend_id: ID!, $user_id: ID!) {
            createFriend(input: { user_id: $user_id, friend_id: $friend_id }) {
              friend {
                name
              }
              friend_id
              user_id
              user {
                name
              }
            }
          }
        `,
        variables: {
          friend_id: p.friend.id,
          user_id: this.loggedUser.id,
        },
      })
      .subscribe(({ data }) => {
        alert('New Friend Added');
      });
  }

  ignoreFriend(p: any): void {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($friend_id: ID!, $user_id: ID!) {
            ignoreFriend(input: { user_id: $user_id, friend_id: $friend_id }) {
              friend {
                name
              }
              friend_id
              user_id
              user {
                name
              }
            }
          }
        `,
        variables: {
          friend_id: p.friend.id,
          user_id: this.loggedUser.id,
        },
      })
      .subscribe(({ data }) => {
        alert('Ignored');
      });
  }

  declineFriend(p: any): void {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($friend_id: ID!, $user_id: ID!) {
            declinedFriend(
              input: { user_id: $user_id, friend_id: $friend_id }
            ) {
              friend {
                name
              }
              friend_id
              user_id
              user {
                name
              }
            }
          }
        `,
        variables: {
          friend_id: p.friend.id,
          user_id: this.loggedUser.id,
        },
      })
      .subscribe(({ data }) => {
        alert('Declined');
      });
  }

  reportFriend(u: any) {
    let reason = prompt('Please input the reason ');
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdfd(
            $reason: String!
            $reporter_id: ID!
            $suspected_id: ID!
          ) {
            createReportRequest(
              input: {
                reason: $reason
                reporter_id: $reporter_id
                suspected_id: $suspected_id
              }
            ) {
              id
            }
          }
        `,
        variables: {
          reason: reason,
          reporter_id: this.loggedUser.id,
          suspected_id: u,
        },
      })
      .subscribe(({ data }) => {
        alert('Successfully report a user');
      });
  }
}
