import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-manage-user',
  templateUrl: './admin-manage-user.component.html',
  styleUrls: ['./admin-manage-user.component.scss'],
})
export class AdminManageUserComponent implements OnInit {
  allUsers: any;
  id: any;
  auth: any;
  loggedUser: any;
  paginator: any;
  reportRequest: any;
  unsuspensionRequest: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paginator = 1;
    this.getAllUsers();
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
    this.getAllReportRequest();
    this.getAllUnsuspensionRequest();
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
      });
  }
  prevPage() {
    this.paginator--;
    this.getAllUsers();
  }

  nextPage() {
    this.paginator++;
    this.getAllUsers();
  }

  getAllUsers() {
    this.apollo
      .query({
        query: gql`
          query asdf($paginator: Int!) {
            getAllUsersPaginate(paginator: $paginator) {
              id
              image
              name
            }
          }
        `,
        variables: { paginator: this.paginator },
      })
      .subscribe(({ data }) => {
        this.allUsers = (data as any).getAllUsersPaginate;
      });
  }

  getAllReportRequest(): void {
    this.apollo
      .query({
        query: gql`
          query asdf {
            getReportRequest {
              id
              reason
              reporter {
                id
                image
                name
              }
              suspected {
                id
                image
                name
              }
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.reportRequest = (data as any).getReportRequest;
        console.log(this.reportRequest);
      });
  }

  getAllUnsuspensionRequest(): void {
    this.apollo
      .query({
        query: gql`
          query asdf {
            getUnsuspensionRequest {
              reason
              user_id
              user {
                id
                name
              }
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.unsuspensionRequest = (data as any).getUnsuspensionRequest;
      });
  }

  addReported(r: any) {
    this.apollo
      .mutate({
        mutation: gql`mutation asdf($user_id){
        addReported(input: $user_id){
          id
        }
      }`,
        variables: { user_id: r.suspected_id },
      })
      .subscribe(({ data }) => {
        alert('Successfully add reported');
      });
  }

  deleteReport(r: any) {
    this.apollo
      .query({
        query: gql`
          query asdf($id: ID!) {
            deleteReport(id: $id)
          }
        `,
        variables: { id: r.id },
      })
      .subscribe(({ data }) => {
        alert('Successfully delete report');
      });
  }

  addUnsuspend(r: any) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($user_id: ID!, $reason: String!, $suspended: Boolean!) {
            createSuspensionList(
              input: {
                user_id: $user_id
                reason: $reason
                suspended: $suspended
              }
            )
          }
        `,
        variables: { user_id: r.user_id, reason: r.reason, suspended: true },
      })
      .subscribe(({ data }) => {
        alert('Still suspended the user');
      });
  }

  deleteUnsuspend(r: any) {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($user_id: ID!, $reason: String!, $suspended: Boolean!) {
            createSuspensionList(
              input: {
                user_id: $user_id
                reason: $reason
                suspended: $suspended
              }
            )
          }
        `,
        variables: { user_id: r.user_id, reason: r.reason, suspended: false },
      })
      .subscribe(({ data }) => {
        alert('Unsuspend the user');
      });
  }
}
