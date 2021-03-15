import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss'],
})
export class MarketComponent implements OnInit {
  gameItems: any;
  paginator: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private apollo: Apollo,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.paginator = 1;
    this.getGameItem();
  }

  private getGameItem(): void {
    this.apollo
      .query({
        query: gql`
          query asdf($page: Int!) {
            getGameItem(input: $page) {
              id
              game_id
              name
              game {
                id
                name
                image
              }
              image
            }
          }
        `,
        variables: { page: this.paginator },
      })
      .subscribe(({ data }) => {
        this.gameItems = (data as any).getGameItem;
      });
  }

  prevItem(): void {
    if (this.paginator - 1 !== 0) {
      this.paginator--;
      this.getGameItem();
    }
  }

  nextItem(): void {
    this.paginator++;
    this.getGameItem();
  }

  goToMarketDetail(c: any): void {
    alert(c);
    this.router.navigateByUrl('market/item/' + c.id);
  }
}
