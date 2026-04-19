import { Component, computed, input, OnInit } from '@angular/core';

@Component({
  selector: 'app-changelog-entry',
  imports: [],
  templateUrl: './changelog-entry.component.html',
  styleUrl: './changelog-entry.component.scss',
})
export class ChangelogEntryComponent implements OnInit {
  readonly additions = input<string[]>();
  readonly fixes = input<string[]>();
  readonly changes = input<string[]>();
  readonly removals = input<string[]>();

  readonly date = input.required<string>();
  formattedDate = '';

  changelog = computed(() =>
    [
      { id: 'additions', items: this.additions() },
      { id: 'changes', items: this.changes() },
      { id: 'fixes', items: this.fixes() },
      { id: 'removals', items: this.removals() },
    ].filter((section) => section.items?.length != 0),
  );

  ngOnInit(): void {
    const date = new Date(this.date());
    this.formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
