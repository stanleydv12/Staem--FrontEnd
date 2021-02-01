import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent implements OnInit {
  gameId: string | null | undefined;
  gameDetail: any = [];
  gameImages: any = [];
  gameVideo: any = '';
  selectedLink: any = '';
  selectedType: any = '';
  auth = false;
  minRequirement: any = [];
  recRequirement: any = [];
  reviews: any;
  user: any;
  id: string | undefined;
  owned = false;
  wish = false;

  InputReviewForm = this.fb.group({
    textarea: ['', Validators.required],
    rating: ['', Validators.required],
  });

  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.gameId = this.activatedRoute.snapshot.paramMap.get('id');
    this.getGameById(this.gameId);
    this.getSystemRequirement(this.gameId);
    this.getMostHelpfulReview(this.gameId);
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

  getGameById(id: string | null): void {
    this.apollo
      .query({
        query: gql`
          query adsfd($id: String!) {
            getGameById(input: $id) {
              id
              name
              genre
              price
              description
              tag
              banner
              image
              about
            }
            getGameImageById(input: $id) {
              id
              gameid
              image
            }
            getGameVideoById(input: $id) {
              id
              gameid
              videolink
            }
          }
        `,
        variables: { id },
      })
      .subscribe(({ data }) => {
        this.gameDetail = (data as any).getGameById;
        this.gameImages = (data as any).getGameImageById;
        this.gameVideo = (data as any).getGameVideoById;
        this.selectedLink = this.gameVideo.videolink;
        this.selectedType = 'video';
      });
  }

  selectImage(link: string): void {
    this.selectedType = 'image';
    this.selectedLink = link;
  }

  selectVideo(): void {
    this.selectedType = 'video';
    this.selectedLink = this.gameVideo.videolink;
  }

  getSystemRequirement(id: string | null): void {
    this.apollo
      .query({
        query: gql`
          query adsfd($id: String!) {
            getRecommendedRequirement(input: $id) {
              id
              gameid
              os
              processor
              memory
              graphics
              storage
            }
            getMinimumRequirement(input: $id) {
              id
              gameid
              os
              processor
              memory
              graphics
              storage
            }
          }
        `,
        variables: { id },
      })
      .subscribe(({ data }) => {
        this.minRequirement = (data as any).getMinimumRequirement;
        this.recRequirement = (data as any).getRecommendedRequirement;
      });
  }

  thumbsup(id: string): void {
    console.log('id:' + id);
    if (this.auth === true) {
      this.apollo
        .mutate({
          mutation: gql`
            mutation asdf($id: String!) {
              updatePositiveReview(input: $id) {
                positive
              }
            }
          `,
          variables: { id },
        })
        .subscribe(({ data }) => {
          window.location.reload();
        });
    }
  }

  thumbsdown(id: string): void {
    console.log('id:' + id);
    if (this.auth === true) {
      this.apollo
        .mutate({
          mutation: gql`
            mutation asdf($id: String!) {
              updateNegativeReview(input: $id) {
                negative
              }
            }
          `,
          variables: { id },
        })
        .subscribe(({ data }) => {
          window.location.reload();
        });
    }
  }

  insertReview(): void {
    const gameid = this.gameId;
    const userid = this.user.id;
    const description = this.InputReviewForm.get('textarea')?.value;
    const rating = this.InputReviewForm.get('rating')?.value;
    console.log(gameid, userid, description, rating);
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf(
            $gameid: ID!
            $userid: ID!
            $description: String!
            $rating: String!
          ) {
            insertReview(
              input: {
                gameid: $gameid
                userid: $userid
                description: $description
                rating: $rating
              }
            ) {
              description
            }
          }
        `,
        variables: { gameid, userid, description, rating },
      })
      .subscribe();
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
        this.checkOwnedGame(this.gameId, this.user.id);
        this.checkWishlist(this.gameId, this.user.id);
      });
  }

  checkOwnedGame(gameid: string | null | undefined, userid: string): void {
    this.apollo
      .query({
        query: gql`
          query asdf($gameid: ID!, $userid: ID!) {
            checkOwnedGame(input: { gameid: $gameid, userid: $userid })
          }
        `,
        variables: { gameid, userid },
      })
      .subscribe(({ data }) => {
        this.owned = (data as any).checkOwnedGame;
      });
  }

  checkWishlist(
    gameid: string | null | undefined,
    userid: string | null | undefined
  ): void {
    this.apollo
      .query({
        query: gql`
          query asdf($gameid: ID!, $userid: ID!) {
            checkWishlist(input: { gameid: $gameid, userid: $userid })
          }
        `,
        variables: { gameid, userid },
      })
      .subscribe(({ data }) => {
        this.wish = (data as any).checkWishlist;
      });
  }

  inputWishlist(
    gameid: string | null | undefined,
    userid: string | null | undefined
  ): void {
    if (this.auth === false) {
      alert('You must login first');
    }
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($gameid: ID!, $userid: ID!) {
            inputWishlist(input: { gameid: $gameid, userid: $userid }) {
              id
            }
          }
        `,
        variables: { gameid, userid },
      })
      .subscribe(({ data }) => {
        this.checkWishlist(gameid, userid);
        window.location.reload();
      });
  }

  deleteWishlist(
    gameid: string | null | undefined,
    userid: string | null | undefined
  ): void {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($gameid: ID!, $userid: ID!) {
            deleteWishlist(input: { gameid: $gameid, userid: $userid }) {
              id
            }
          }
        `,
        variables: { gameid, userid },
      })
      .subscribe(({ data }) => {
        this.checkWishlist(gameid, userid);
        window.location.reload();
      });
  }

  private getMostHelpfulReview(id: string | null): void {
    this.apollo
      .query({
        query: gql`
          query adsfd($id: String!) {
            getMostHelpfulReview(input: $id) {
              id
              game {
                id
              }
              user {
                name
                image
              }
              description
              rating
              positive
              negative
            }
          }
        `,
        variables: { id },
      })
      .subscribe(({ data }) => {
        this.reviews = (data as any).getMostHelpfulReview;
        console.log(this.reviews);
      });
  }
}
