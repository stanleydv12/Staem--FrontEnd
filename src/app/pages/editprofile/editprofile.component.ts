import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss'],
})
export class EditprofileComponent implements OnInit {
  userId: string | null | undefined;
  auth: boolean | undefined;
  id: string | undefined;
  myProfile: boolean | undefined;
  user: any;
  insertGameForm = this.fb.group({
    name: ['', Validators.required],
    summary: ['', Validators.required],
  });
  ownedAvatar: any;
  ownedAvatarBorder: any;
  ownedMiniProfile: any;
  ownedProfileBackground: any;
  ownedBadges: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
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
            this.getUser();
          } else {
            this.router.navigateByUrl('profile/' + this.id);
          }
        });
    } else {
      this.auth = false;
      this.router.navigateByUrl('profile/' + this.id);
    }
  }

  private getUser(): void {
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
              background
              mini_profile_background
              country
              wallet
              image
              border
              theme
              badge
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
        this.getOwnedDetail();
      });
  }

  udpateProfileDetail() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($user_id: ID!, $name: String!, $summary: String!) {
            updateUserProfileDetail(
              input: { user_id: $user_id, name: $name, summary: $summary }
            )
          }
        `,
        variables: {
          user_id: this.id,
          name: this.insertGameForm.get('name')?.value,
          summary: this.insertGameForm.get('summary')?.value,
        },
      })
      .subscribe(({ data }) => {
        alert('Successfully update profile detail');
        window.location.reload();
      });
  }

  getOwnedDetail() {
    this.apollo
      .query({
        query: gql`
          query asdf($id: ID!) {
            getOwnedAvatar(id: $id) {
              item {
                id
                path
              }
              user_id
            }
            getOwnedAvatarBorder(id: $id) {
              item {
                id
                path
              }
              user_id
            }
            getOwnedMiniProfile(id: $id) {
              item {
                id
                path
              }
              user_id
            }
            getOwnedProfileBackground(id: $id) {
              item {
                id
                path
              }
              user_id
            }
            getOwnedBadges(id: $id) {
              badge {
                id
                image
              }
              user_id
            }
          }
        `,
        variables: { id: this.id },
      })
      .subscribe(({ data }) => {
        this.ownedAvatar = (data as any).getOwnedAvatar;
        this.ownedAvatarBorder = (data as any).getOwnedAvatarBorder;
        this.ownedMiniProfile = (data as any).getOwnedMiniProfile;
        this.ownedProfileBackground = (data as any).getOwnedProfileBackground;
        this.ownedBadges = (data as any).getOwnedBadges;
      });
  }

  updateAvatar(a: any) {
    let confirm = window.confirm(
      'Are you sure want to update to this avatar ?'
    );
    if (!confirm) return;
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($path: String!, $user_id: ID!) {
            updateAvatar(input: { path: $path, user_id: $user_id })
          }
        `,
        variables: { path: a, user_id: this.id },
      })
      .subscribe(({ data }) => {
        alert('Successfully update avatar');
        window.location.reload();
      });
  }

  updateAvatarBorder(a: any) {
    let confirm = window.confirm(
      'Are you sure want to update to this avatar ?'
    );
    if (!confirm) return;
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($path: String!, $user_id: ID!) {
            updateAvatarBorder(input: { path: $path, user_id: $user_id })
          }
        `,
        variables: { path: a, user_id: this.id },
      })
      .subscribe(({ data }) => {
        alert('Successfully update avatar border');
        window.location.reload();
      });
  }

  updateProfileBackground(path: any) {
    let confirm = window.confirm(
      'Are you sure want to update to this profile background ?'
    );
    if (!confirm) return;
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($path: String!, $user_id: ID!) {
            updateProfileBackground(input: { path: $path, user_id: $user_id })
          }
        `,
        variables: { path: path, user_id: this.id },
      })
      .subscribe(({ data }) => {
        alert('Successfully update profile background');
        window.location.reload();
      });
  }

  updateMiniProfile(path: any) {
    let confirm = window.confirm(
      'Are you sure want to update to this mini background ?'
    );
    if (!confirm) return;
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($path: String!, $user_id: ID!) {
            updateMiniProfileBackground(
              input: { path: $path, user_id: $user_id }
            )
          }
        `,
        variables: { path: path, user_id: this.id },
      })
      .subscribe(({ data }) => {
        alert('Successfully update mini profile background');
        window.location.reload();
      });
  }

  updateTheme(path: any) {
    let confirm = window.confirm('Are you sure want to update to this theme ?');
    if (!confirm) return;
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($path: String!, $user_id: ID!) {
            updateTheme(input: { path: $path, user_id: $user_id })
          }
        `,
        variables: { path: path, user_id: this.id },
      })
      .subscribe(({ data }) => {
        alert('Successfully update theme background');
        window.location.reload();
      });
  }

  updateBadge(path: any) {
    let confirm = window.confirm('Are you sure want to update to this badge ?');
    if (!confirm) return;
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($path: String!, $user_id: ID!) {
            updateBadges(input: { path: $path, user_id: $user_id })
          }
        `,
        variables: { path: path, user_id: this.id },
      })
      .subscribe(({ data }) => {
        alert('Successfully update badges');
        window.location.reload();
      });
  }
}
