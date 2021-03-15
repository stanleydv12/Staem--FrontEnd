import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { subscribe } from 'graphql';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  paginator: any;
  userId: any | undefined;
  myProfile: any | undefined;
  id: any | undefined;
  auth: boolean | undefined;
  loggedUser: any;
  profileUser: any;
  profileComment: any;
  comment: any;
  ownedGames: any;
  profileReview: any;
  profileDiscussion: any;
  profilePaginator: any;
  miniProfile: boolean | undefined;
  friendDetail: any | undefined;
  addButton: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paginator = 1;
    this.profilePaginator = 1;
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');

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
          }
          this.getUser();
          this.getUserProfile();
          this.checkFriend();
        });
    } else {
      this.auth = false;
      this.getUser();
      this.getUserProfile();
      this.checkFriend();
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
        this.checkFriend();
      });
  }

  private getUserProfile(): void {
    const id = this.userId;
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
              level
              badge
              summary
              theme
              background
              friends {
                friend {
                  id
                  name
                  level
                  image
                  badge
                  status
                }
              }
              friend_request {
                friend {
                  id
                  name
                  level
                  image
                  status
                }
              }
            }
          }
        `,
        variables: { id },
      })
      .subscribe(({ data }) => {
        this.profileUser = (data as any).getUserById;
        this.getProfileComment();
        this.getProfileGame();
        this.getProfileDiscussion();
        this.getProfileReview();
      });
  }

  getProfileComment(): void {
    this.apollo
      .query({
        query: gql`
          query asdf($user_id: ID!, $paginator: Int!) {
            getProfileComment(id: $user_id, paginator: $paginator) {
              comment
              user_id
            }
          }
        `,
        variables: { user_id: this.profileUser.id, paginator: this.paginator },
      })
      .subscribe(({ data }) => {
        this.profileComment = (data as any).getProfileComment;
      });
  }

  addProfileComment(): void {
    if (!this.myProfile) {
      alert('This is not your profile !!!');
      return;
    }
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($user_id: ID!, $comment: String!) {
            addProfileComment(input: { user_id: $user_id, comment: $comment }) {
              comment
              user_id
            }
          }
        `,
        variables: { comment: this.comment, user_id: this.loggedUser.id },
      })
      .subscribe(({ data }) => {
        alert('New Comment Added !!!');
        window.location.reload();
      });
  }

  private getProfileGame(): void {
    this.apollo
      .query({
        query: gql`
          query asdf($user_id: ID!) {
            getOwnedGames(input: $user_id) {
              game {
                id
                image
                name
              }
              user {
                id
                name
              }
            }
          }
        `,
        variables: { user_id: this.profileUser.id },
      })
      .subscribe(({ data }) => {
        this.ownedGames = (data as any).getOwnedGames;
      });
  }

  private getProfileReview(): void {
    this.apollo
      .query({
        query: gql`
          query asdf($user_id: ID!, $offset: Int!) {
            getCommunityReviewByID(
              input: { user_id: $user_id, offset: $offset }
            ) {
              review_content
              rating
            }
          }
        `,
        variables: {
          user_id: this.profileUser.id,
          offset: (this.profilePaginator - 1) * 2,
        },
      })
      .subscribe(({ data }) => {
        this.profileReview = (data as any).getCommunityReviewByID;
      });
  }

  private getProfileDiscussion(): void {
    this.apollo
      .query({
        query: gql`
          query asdf($user_id: ID!, $offset: Int!) {
            getCommunityDiscussionByID(
              input: { user_id: $user_id, offset: $offset }
            ) {
              discussion_content
              game {
                name
              }
            }
          }
        `,
        variables: {
          user_id: this.profileUser.id,
          offset: (this.profilePaginator - 1) * 2,
        },
      })
      .subscribe(({ data }) => {
        this.profileDiscussion = (data as any).getCommunityDiscussionByID;
      });
  }

  incPaginator(): void {
    this.profilePaginator++;
    this.getProfileReview();
    this.getProfileDiscussion();
    // alert(this.profilePaginator);
    // window.location.reload();
  }

  decPaginator(): void {
    if (this.profilePaginator - 1 !== 0) {
      this.profilePaginator--;
      this.getProfileReview();
      this.getProfileDiscussion();
      // alert(this.profilePaginator);
      // window.location.reload();
    }
  }

  showMiniProfile(f: any): void {
    this.friendDetail = f;
    this.miniProfile = true;
  }

  editProfile(): void {
    if (!this.myProfile) {
      alert('You cant edit someone profile !!!');
      return;
    }

    this.router.navigateByUrl('editprofile/' + this.loggedUser.id);
  }

  checkFriend(): void {
    this.apollo
      .query({
        query: gql`
          query asdf($user_id: ID!, $friend_id: ID!) {
            checkFriend(input: { user_id: $user_id, friend_id: $friend_id })
          }
        `,
        variables: { user_id: this.loggedUser.id, friend_id: this.userId },
      })
      .subscribe(({ data }) => {
        // @ts-ignore
        this.addButton = (data as boolean).checkFriend;
      });
  }

  prevItem() {
    this.paginator--;
    this.getProfileComment();
  }

  nextItem() {
    this.paginator++;
    this.getProfileComment();
  }

  createRequest() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($user_id: ID!, $friend_id: ID!) {
            createFriendRequest(
              input: { user_id: $user_id, friend_id: $friend_id }
            ) {
              friend_id
              user_id
            }
          }
        `,
        variables: {
          user_id: this.loggedUser.id,
          friend_id: this.profileUser.id,
        },
      })
      .subscribe(({ data }) => {
        alert('Successfully send friend request to a user');
      });
  }
}
