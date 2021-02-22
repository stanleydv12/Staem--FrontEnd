import { Apollo, gql } from 'apollo-angular';

class User {
  id: any;
  name: any;
  email: any;
  password: any;
  wallet: any;
  image: any;
  country: any;

  constructor(private apollo: Apollo) {}

  updateUser(): void {
    this.apollo
      .mutate({
        mutation: gql`
          mutation adsfd(
            $id: ID!
            $name: String!
            $email: String!
            $password: String!
            $wallet: Float!
            $image: String!
            $country: String!
          ) {
            updateUser(
              input: {
                id: $id
                name: $name
                email: $email
                password: $password
                wallet: $wallet
                image: $image
                country: $country
              }
            ) {
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
        variables: {
          id: this.id,
          name: this.name,
          email: this.email,
          password: this.password,
          wallet: this.wallet,
          image: this.image,
          country: this.country,
        },
      })
      .subscribe(({ data }) => {
        alert('Updated');
      });
  }
}
