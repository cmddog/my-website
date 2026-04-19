import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ThemeService } from '@services';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  private readonly themeService = inject(ThemeService);

  @ViewChild('checkbox', { static: true }) checkboxRef!: ElementRef;

  ngOnInit() {
    if (this.themeService.isSwapped()) {
      this.checkboxRef.nativeElement.checked = true;
    }
  }

  onThemeSwap(event: Event) {
    this.themeService.toggle((event.target as HTMLInputElement).checked);
  }
}
