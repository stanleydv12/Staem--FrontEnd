import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
})
export class AdminLoginComponent implements OnInit {
  valid: any;
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  message: any;
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.apollo
        .query<{ loginAdmin: string }>({
          query: gql`
            query asdf($email: String!, $password: String!) {
              loginAdmin(input: { email: $email, password: $password })
            }
          `,
          variables: this.loginForm.value,
        })
        .subscribe(({ data }) => {
          this.valid = data.loginAdmin;
          this.checkValid();
        });
    }
  }

  checkValid(): void {
    if (this.valid === '') {
      this.message = 'Account not Found or Credential Wrong';
      window.alert(this.message);
    } else {
      window.alert('Success');
      localStorage.setItem('jwt', this.valid as any);
      this.router.navigateByUrl('admin-manage/game');
    }
    console.log(this.valid);
  }
}
