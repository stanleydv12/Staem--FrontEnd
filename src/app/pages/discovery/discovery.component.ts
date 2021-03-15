import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.component.html',
  styleUrls: ['./discovery.component.scss'],
})
export class DiscoveryComponent implements OnInit {
  personalizedGames: any;
  recentGames: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.allGames();
  }

  allGames(): void {
    this.apollo
      .query({
        query: gql`
          query asdf {
            getPersonalizedGames {
              id
              name
              about
              mature
              price
              image
            }
            getMostRecentGames {
              id
              name
              about
              mature
              price
              image
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        console.log(data);
        this.personalizedGames = (data as any).getPersonalizedGames;
        this.recentGames = (data as any).getMostRecentGames;
      });
  }
}
