import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.scss'],
})
export class ImageSliderComponent implements OnInit {
  games: any = [];
  slideIndex = 1;
  valid: boolean | undefined;

  constructor(private apollo: Apollo) {}

  plusSlides(n: number): void {
    this.showSlides((this.slideIndex += n));
  }

  currentSlide(n: number): void {
    this.showSlides((this.slideIndex = n));
  }

  showSlides(n: number): void {
    let i;
    const slides = document.getElementsByClassName('mySlides');
    const dots = document.getElementsByClassName('dot');
    if (n > slides.length) {
      this.slideIndex = 1;
    }
    if (n < 1) {
      this.slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      console.log(slides[i]);
      (slides[i] as any).style.display = 'none';
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(' active', '');
    }
    console.log(slides);
    console.log(this.slideIndex - 1);
    console.log(slides[this.slideIndex - 1]);
    (slides[this.slideIndex - 1] as any).style.display = 'block';
    dots[this.slideIndex - 1].className += ' active';
  }

  getImageSlider(): void {
    this.apollo
      .query({
        query: gql`
          query adsfd {
            getImageSlider {
              id
              name
              image
            }
          }
        `,
      })
      .subscribe(({ data }) => {
        this.games = (data as any).getImageSlider;
        console.log(this.games);
      });
  }

  ngOnInit(): void {
    this.getImageSlider();
    if (this.games.length > 0) {
      this.valid = true;
    }
    if (this.valid) {
      this.showSlides(this.slideIndex);
    }
  }
}
