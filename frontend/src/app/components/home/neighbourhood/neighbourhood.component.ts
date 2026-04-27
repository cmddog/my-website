import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-neighbourhood',
  imports: [],
  templateUrl: './neighbourhood.component.html',
  styleUrl: './neighbourhood.component.scss',
})
export class NeighbourhoodComponent {
  copied = signal(false);

  readonly code = `<a href="https://shiru.dog" target="_blank" rel="noopener noreferrer">
  <img
    src="https://shiru.dog/assets/button.png"
    alt="Shiru's site"
    height="31"
    width="88"
  />
</a>`;

  copy() {
    navigator.clipboard.writeText(this.code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 3000);
    });
  }
}
