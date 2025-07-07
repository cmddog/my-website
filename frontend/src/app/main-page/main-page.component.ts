import { Component, inject, OnInit } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { map, shareReplay } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

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

  private breakpointObserver = inject(BreakpointObserver);

  readonly isHandsetPortrait$ = this.breakpointObserver
    .observe([Breakpoints.HandsetPortrait])
    .pipe(
      map((result) => result.matches),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

  ngOnInit(): void {
    if (localStorage.getItem('alreadyVisited')) {
      this.spriteNumber = this.randomSprite();
    } else {
      this.spriteNumber = 1;
      localStorage.setItem('alreadyVisited', 'true');
    }
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
  }
}
