import { Component, inject, input } from '@angular/core';
import { SettingsService } from '../../services/settings.service';
import { SettingsData } from '@types';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  protected readonly settings = inject(SettingsService);
  readonly settingsData = input.required<SettingsData>();
}
