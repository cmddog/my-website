import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nsfw',
  imports: [],
  templateUrl: './nsfw.component.html',
  styleUrl: './nsfw.component.scss',
})
export class NsfwComponent {
  private readonly router = inject(Router);

  constructor() {
    localStorage.setItem('show-nsfw', 'true');
    this.router.navigate(['/']).then();
  }
}
