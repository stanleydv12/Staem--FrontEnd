import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';
import { subscribe } from 'graphql';

@Component({
  selector: 'app-chat-detail',
  templateUrl: './chat-detail.component.html',
  styleUrls: ['./chat-detail.component.scss'],
})
export class ChatDetailComponent implements OnInit {
  id: any;
  auth: any;
  userId: any;
  myProfile: any;
  user: any;
  message: any;
  user_chat: any;
  friend_chat: any;

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
        this.getOwnedStickers();
        this.apollo
          .subscribe({
            query: gql`
              subscription asdf($user_id: ID!) {
                privateChatAdded(userID: $user_id)
              }
            `,
            variables: { user_id: this.id },
          })
          .subscribe(({ data }) => {
            this.friend_chat = (data as any).privateChatAdded;
          });
      });
  }

  insertChat() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($msg: String!, $friend_id: ID!) {
            insertChat(friend_id: $friend_id, msg: $msg)
          }
        `,
        variables: {
          msg: this.message,
          friend_id: this.activatedRoute.snapshot.paramMap.get('id'),
        },
      })
      .subscribe(({ data }) => {
        this.user_chat = (data as any).insertChat;
      });
  }

  getOwnedStickers(): void {
    this.apollo
      .query({
        query: gql`
          query asdf($user_id: ID!) {
            getOwnedChatSticker(id: $user_id) {
              item {
                id
                path
              }
              user_id
            }
          }
        `,
        variables: { user_id: this.user.id },
      })
      .subscribe(({ data }) => {
        console.log((data as any).getOwnedChatSticker);
      });
  }
}
