import { Component, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  countries: any;
  user: any;
  auth: any;
  id: any;
  msg: any;

  paymentForm = this.fb.group({
    card: ['', Validators.required],
    card_number: ['', Validators.required],
    date: ['', Validators.required],
    name: ['', Validators.required],
    address: ['', Validators.required],
    postal_code: ['', Validators.required],
    phone_number: ['', Validators.required],
    country: ['', Validators.required],
    check: null,
  });

  constructor(
    private apollo: Apollo,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getCountries();
    this.checkUser();
    this.msg = this.activatedRoute.snapshot.paramMap.get('msg');
  }

  onSubmit(): void {
    if (this.paymentForm.value.check === true) {
      this.paymentForm.controls.date.setValue(
        new Date(this.paymentForm.value.date)
      );
      this.apollo
        .mutate({
          mutation: gql`
            mutation asdf(
              $userid: ID!
              $card: String!
              $card_number: String!
              $date: Time!
              $name: String!
              $address: String!
              $postal_code: String!
              $phone_number: String!
              $country: String!
            ) {
              savePaymentMethod(
                input: {
                  userid: $userid
                  card: $card
                  address: $address
                  card_number: $card_number
                  country: $country
                  date: $date
                  name: $name
                  phone_number: $phone_number
                  postal_code: $postal_code
                }
              ) {
                name
                address
                card_number
                country
                date
              }
            }
          `,
          variables: {
            userid: this.id,
            card: this.paymentForm.value.card,
            address: this.paymentForm.value.address,
            card_number: this.paymentForm.value.card_number,
            country: this.paymentForm.value.country,
            date: this.paymentForm.value.date,
            name: this.paymentForm.value.name,
            phone_number: this.paymentForm.value.phone_number,
            postal_code: this.paymentForm.value.postal_code,
          },
        })
        .subscribe(({ data }) => {
          console.log('aaaaa');
          console.log((data as any).savePaymentMethod);
        });
    }
  }

  private getCountries(): void {
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

  private checkUser(): void {
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
}
