import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  valid: string | undefined;
  message: string | undefined;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  modal: any;
  reason: any;

  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.modal = false;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.apollo
        .query<{ login: string }>({
          query: gql`
            query asdf($email: String!, $password: String!) {
              login(input: { email: $email, password: $password })
            }
          `,
          variables: this.loginForm.value,
        })
        .subscribe(({ data }) => {
          this.valid = data.login;
          this.checkValid();
        });
    }
  }

  checkValid(): void {
    if (this.valid === '') {
      this.message = 'Account not Found or Credential Wrong';
      window.alert(this.message);
    } else if (this.valid === 'Suspended') {
      window.alert('Your account is suspended..');
      this.modal = true;
    } else {
      window.alert('Success');
      localStorage.setItem('jwt', this.valid as any);
      this.router.navigateByUrl('home');
    }
    console.log(this.valid);
  }

  createRequest() {
    this.apollo
      .mutate({
        mutation: gql`
          mutation asdf($email: String!, $reason: String!) {
            createUnsuspensionRequest(
              input: { reason: $reason, user_email: $email }
            ) {
              reason
              user_id
            }
          }
        `,
        variables: {
          reason: this.reason,
          email: this.loginForm.get('email')?.value,
        },
      })
      .subscribe(({ data }) => {
        alert('Unsuspend request sent');
      });
  }
}
