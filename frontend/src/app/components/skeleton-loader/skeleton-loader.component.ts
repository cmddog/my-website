import { Component, input, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: "skeleton-loader.component.html",
  styleUrl: "skeleton-loader.component.scss"
})
export class SkeletonLoaderComponent implements OnInit, OnDestroy {
  width = input<string>('100%');
  height = input<string>('100%');
  borderRadius = input<string>('2rem');
  display = input<boolean>(true);
  debounceTime = input<number>(100);

  showLoader = signal(false);
  private timeout?: number;

  ngOnInit() {
    if (this.display()) {
      this.timeout = window.setTimeout(() => {
        this.showLoader.set(true);
      }, this.debounceTime());
    }
  }

  ngOnDestroy() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }
}
