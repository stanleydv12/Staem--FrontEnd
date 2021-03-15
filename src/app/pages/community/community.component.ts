import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { JwPaginationComponent } from 'jw-angular-pagination';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss'],
})
export class CommunityComponent implements OnInit {
  imgvideos: boolean | undefined;
  reviews: boolean | undefined;
  disc: boolean | undefined;
  communityContent: any;
  communityReview: any;
  communityDiscussion: any;
  contentDetail: boolean;
  auth = false;
  id: any | undefined;
  user: any | undefined;
  comment: any;
  reviewPaginator: any;
  imageVideoPaginator: any;

  chosenCommunityContent: any | undefined;
  chosenContentDetail: any | undefined;
  contentReview: boolean;
  chosenReview: any | undefined;
  chosenReviewDetail: any | undefined;
  contentDiscussion: boolean;
  chosenDiscussion: any | undefined;
  chosenDiscussionDetail: any;
  chosenContentId: any;

  constructor(private apollo: Apollo) {
    this.imgvideos = false;
    this.reviews = true;
    this.disc = false;
    this.contentDetail = false;
    this.contentReview = false;
    this.contentDiscussion = false;
  }

  ngOnInit(): void {
    this.reviewPaginator = 1;
    this.imageVideoPaginator = 1;
    this.getCommunityContent();
    this.getCommunityReview();
    this.getCommunityDiscussionGame();
    this.getAuth();
  }

  setImgVideos(): void {
    this.reviews = this.disc = false;
    this.imgvideos = true;
  }

  setReviews(): void {
    this.disc = this.imgvideos = false;
    this.reviews = true;
  }

  setDisc(): void {
    this.imgvideos = this.reviews = false;
    this.disc = true;
  }

  getCommunityContentDetail(id: any): void {
    this.chosenContentId = id;
    let temp;
    this.apollo
      .query({
        query: gql`
          query asdf($content_id: ID!, $paginator: Int!) {
            getCommunityContentDetail(
              content_id: $content_id
              paginator: $paginator
            ) {
              content_id
              content {
                id
                content_path
                content_description
                userid
                content_type
                userid
                positive
                negative
              }
              user {
                id
                email
                name
                image
              }
              user_id
              review
            }
          }
        `,
        variables: {
          content_id: id,
          paginator: this.imageVideoPaginator,
        },
      })
      .subscribe(({ data }) => {
        this.chosenContentDetail = (data as any).getCommunityContentDetail;
        this.contentDetail = true;
        temp = Number(id);
        this.chosenCommunityContent = this.communityContent[temp - 1];
        console.log(this.chosenCommunityContent);
      });
  }

  getCommunityContent(): void {
    this.apollo
      .query({
        query: gql`
          query asdf {
            getCommunityContent {
              id
              content_path
              content_description
              content_type
              userid
              user {
                id
                name
                image
              }
              positive
              negative
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.communityContent = (data as any).getCommunityContent;
      });
  }

  getCommunityReview(): void {
    this.apollo
      .query({
        query: gql`
          query asdf {
            getCommunityReview {
              id
              review_content
              user_id
              user {
                id
                name
                image
              }
              rating
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.communityReview = (data as any).getCommunityReview;
      });
  }

  private getAuth(): void {
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
      });
  }

  addCommunityContentDetail(): void {
    if (!this.auth) {
      alert('You need to login first !!!');
      return;
    }

    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($content_id: ID!, $review: String!, $user_id: ID!) {
            addCommunityContentReview(
              input: {
                content_id: $content_id
                review: $review
                user_id: $user_id
              }
            ) {
              content_id
              content {
                id
                content_description
              }
              user_id
              user {
                name
              }
              review
            }
          }
        `,
        variables: {
          review: this.comment,
          content_id: this.chosenCommunityContent.id,
          user_id: this.id,
        },
      })
      .subscribe(({ data }) => {
        alert('Comment added');
      });
  }

  voteDownContent(c: any): void {
    if (!this.auth) {
      alert('You need to login first !!!');
      return;
    }

    const a = c.negative + 1;

    this.apollo
      .mutate({
        mutation: gql`
          mutation asdafg($content_id: ID!, $positive: Int!, $negative: Int!) {
            updateCommunityContentThumbs(
              input: {
                content_id: $content_id
                positive: $positive
                negative: $negative
              }
            ) {
              content_description
              positive
              negative
            }
          }
        `,
        variables: {
          content_id: c.id,
          positive: c.positive,
          negative: a,
        },
      })
      .subscribe(({ data }) => {
        window.location.reload();
      });
  }

  voteUpContent(c: any): void {
    if (!this.auth) {
      alert('You need to login first !!!');
      return;
    }

    const a = c.positive + 1;

    this.apollo
      .mutate({
        mutation: gql`
          mutation asdafg($content_id: ID!, $positive: Int!, $negative: Int!) {
            updateCommunityContentThumbs(
              input: {
                content_id: $content_id
                positive: $positive
                negative: $negative
              }
            ) {
              content_description
              positive
              negative
            }
          }
        `,
        variables: {
          content_id: c.id,
          positive: a,
          negative: c.negative,
        },
      })
      .subscribe(({ data }) => {
        window.location.reload();
      });
  }

  getCommunityReviewDetail(c: any): void {
    this.apollo
      .query({
        query: gql`
          query asdf($review_id: ID!, $paginator: Int!) {
            getCommunityReviewDetail(
              review_id: $review_id
              paginator: $paginator
            ) {
              review_id
              review_content
              user_id
              user {
                name
                email
                image
              }
            }
          }
        `,
        variables: { review_id: c.id, paginator: this.reviewPaginator },
      })
      .subscribe(({ data }) => {
        this.chosenReviewDetail = (data as any).getCommunityReviewDetail;
        this.chosenReview = c;
        this.contentReview = true;
      });
  }

  addCommunityReviewDetail(): void {
    if (!this.auth) {
      alert('You need to login first !!!');
      return;
    }

    alert(this.comment);

    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($review_id: ID!, $review: String!, $user_id: ID!) {
            addCommunityReviewDetail(
              input: {
                review_id: $review_id
                review_content: $review
                user_id: $user_id
              }
            ) {
              review_content
              review_id
              user_id
              user {
                name
              }
            }
          }
        `,
        variables: {
          review: this.comment,
          review_id: this.chosenReview.id,
          user_id: this.id,
        },
      })
      .subscribe(({ data }) => {
        alert('Comment added');
      });
  }

  private getCommunityDiscussionGame(): void {
    this.apollo
      .query({
        query: gql`
          query asdf {
            getCommunityDiscussionGame {
              id
              image
              name
              banner
              discussions {
                discussion_content
                user_id
                id
                game_id
                game {
                  image
                  name
                  price
                  description
                }
                user {
                  id
                  image
                  name
                }
              }
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.communityDiscussion = (data as any).getCommunityDiscussionGame;
      });
  }

  getCommunityDiscussionComment(c: any): void {
    this.apollo
      .query({
        query: gql`
          query asdf($discussion_id: ID!) {
            getCommunityDiscussioDetail(input: $discussion_id) {
              discussion_content
              user {
                id
                image
                name
              }
            }
          }
        `,
        variables: { discussion_id: c.id },
      })
      .subscribe(({ data }) => {
        this.chosenDiscussionDetail = (data as any).getCommunityDiscussioDetail;
        this.chosenDiscussion = c;
        this.contentDiscussion = true;
      });
  }

  addCommunityDiscussionDetail(): void {
    if (!this.auth) {
      alert('You need to login first !!!');
      return;
    }

    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf(
            $discussion_id: ID!
            $user_id: ID!
            $game_id: ID!
            $discussion_content: String!
          ) {
            addCommunityDiscussionDetail(
              input: {
                discussion_id: $discussion_id
                discussion_content: $discussion_content
                user_id: $user_id
                game_id: $game_id
              }
            ) {
              discussion_content
              discussion_id
              game_id
              user_id
            }
          }
        `,
        variables: {
          discussion_id: this.chosenDiscussion.id,
          user_id: this.id,
          game_id: this.chosenDiscussion.game_id,
          discussion_content: this.comment,
        },
      })
      .subscribe(({ data }) => {
        alert('Comment added');
      });
  }

  nextReview() {
    this.reviewPaginator += 1;
    console.log(this.reviewPaginator);
    this.getCommunityReviewDetail(this.chosenReview);
  }

  prevReview() {
    this.reviewPaginator -= 1;
    this.getCommunityReviewDetail(this.chosenReview);
  }

  nextContent() {
    this.imageVideoPaginator++;
    console.log(this.chosenContentDetail.id);
    this.getCommunityContentDetail(this.chosenContentId);
  }

  prevContent() {
    this.imageVideoPaginator--;
    console.log(this.chosenContentDetail.id);
    this.getCommunityContentDetail(this.chosenContentId);
  }
}
