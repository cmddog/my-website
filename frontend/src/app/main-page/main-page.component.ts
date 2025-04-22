import { Component, OnInit } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-main-page',
  imports: [NgOptimizedImage, NgClass],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent implements OnInit {
  spriteNumber = 0;
  previousSprite = 0;
  isChanging = true;
  initialAnimation = true;
  spriteLoadedArray: boolean[] = [false, false, false];

  ngOnInit(): void {
    console.log('Initial values', this.spriteLoadedArray);
    if (localStorage.getItem('alreadyVisited')) {
      this.spriteNumber = this.randomSprite();
    } else {
      this.spriteNumber = 1;
      localStorage.setItem('alreadyVisited', 'true');
    }
    console.log('sprite number initiated: ', this.spriteNumber);
    setTimeout(() => {
      this.initialAnimation = false;
    }, 200);
  }

  randomSprite(n?: number) {
    if (!n) this.spriteNumber = 0;
    do {
      n = Math.floor(Math.random() * 3) + 1;
    } while (n === this.previousSprite);
    return n;
  }

  changeSprite() {
    if (this.isChanging) return;
    this.previousSprite = this.spriteNumber;
    this.spriteNumber = 0;
    this.isChanging = true;
    setTimeout(() => {
      this.spriteNumber = this.randomSprite(this.previousSprite);
      setTimeout(() => {
        this.isChanging = false;
      }, 150);
    }, 200);
  }

  spriteLoaded(n: number) {
    this.spriteLoadedArray[n - 1] = true;
    if (n === this.spriteNumber) {
      setTimeout(() => {
        this.isChanging = false;
      }, 150);
    }
    console.log('Adjusted load array:', this.spriteLoadedArray);
  }
}
