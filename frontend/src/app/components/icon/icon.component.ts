import {
  Component,
  effect,
  HostBinding,
  inject,
  input,
  signal,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, map, Observable } from 'rxjs';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  readonly icon = input.required<string>();
  readonly fallback = input<string>();

  private readonly http = inject(HttpClient);
  private readonly sanitizer = inject(DomSanitizer);
  readonly size = input<number>(20);

  @HostBinding('style.--icon-size.px')
  get iconSize() {
    return this.size();
  }

  readonly svgContent = signal<string | null>(null);

  private loadIcon(name: string): Observable<string> {
    return this.http
      .get(`/assets/icons/${name}.svg`, { responseType: 'text' })
      .pipe(
        map((svg) => this.sanitizer.bypassSecurityTrustHtml(svg) as string),
      );
  }

  constructor() {
    effect(() => {
      const name = this.icon();
      const fb = this.fallback();

      const load$ = fb
        ? this.loadIcon(name).pipe(catchError(() => this.loadIcon(fb)))
        : this.loadIcon(name);

      load$.subscribe({
        next: (svg) => this.svgContent.set(svg),
        error: () => this.svgContent.set(''),
      });
    });
  }
}
