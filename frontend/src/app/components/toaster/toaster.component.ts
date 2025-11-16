import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToasterService } from '@services';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.scss'],
})
export class ToasterComponent {
  private readonly toaster = inject(ToasterService);

  protected readonly toasts = this.toaster.state;

  close(id: number): void {
    this.toaster.remove(id);
  }
}
