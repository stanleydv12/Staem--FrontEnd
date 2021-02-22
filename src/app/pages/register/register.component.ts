import { Component, OnInit } from '@angular/core';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  username: string | undefined;
  email: string | undefined;
  countries: string[] = [];

  registerForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    c_password: ['', Validators.required],
    country: ['', Validators.required],
    check: null,
  });

  constructor(private fb: FormBuilder, private apollo: Apollo) {}

  public resolved(captchaResponse: string): void {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

  public onError(errorDetails: RecaptchaErrorParameters): void {
    console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }

  ngOnInit(): void {
    this.apollo
      .query<any>({
        query: gql`
          query asd {
            countries {
              id
              name
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.countries = data.countries.map((c: { name: any }) => c.name);
      });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { password, c_password } = this.registerForm.value;
      if (password !== c_password) {
        return;
      }
      this.apollo
        .mutate({
          mutation: gql`
            mutation asdf(
              $username: String!
              $password: String!
              $email: String!
              $country: String!
            ) {
              register(
                input: {
                  name: $username
                  email: $email
                  password: $password
                  country: $country
                }
              ) {
                id
              }
            }
          `,
          variables: this.registerForm.value,
        })
        .subscribe();
    }
  }
}
