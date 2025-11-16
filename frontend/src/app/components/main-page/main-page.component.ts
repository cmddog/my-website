import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { map, shareReplay } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ThemeService, ToasterService } from '@services';

@Component({
  selector: 'app-main-page',
  imports: [NgOptimizedImage, NgClass, AsyncPipe],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
})
export class MainPageComponent implements OnInit {
  private previousSprite = 0;
  protected spriteNumber = 0;
  protected isChanging = true;
  protected initialAnimation = true;
  protected spriteLoadedArray: boolean[] = [false, false, false];

  private breakpointObserver = inject(BreakpointObserver);
  protected themeService = inject(ThemeService);
  readonly sizeDynamic$ = this.breakpointObserver
    .observe([`(max-width: 47.5rem)`])
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

  private randomSprite(n?: number) {
    if (!n) this.spriteNumber = 0;
    do {
      n = Math.floor(Math.random() * 3) + 1;
    } while (n === this.previousSprite);
    return n;
  }

  protected changeSprite() {
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

  protected spriteLoaded(n: number) {
    this.spriteLoadedArray[n - 1] = true;
    if (n === this.spriteNumber) {
      setTimeout(() => {
        this.isChanging = false;
      }, 150);
    }
  }

  private readonly toaster = inject(ToasterService);
  protected success(): void {
    this.toaster.show('Success!', 'success');
  }

  protected info(): void {
    this.toaster.show('Info!', 'info');
  }

  protected warning(): void {
    this.toaster.show('Warning!', 'warning');
  }

  protected error(): void {
    this.toaster.show('Error!', 'error');
  }
}
