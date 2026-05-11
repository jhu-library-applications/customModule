import { Component } from '@angular/core';

@Component({
  selector: 'custom-nde-fetch-item-journal-option-hider',
  standalone: true,
  imports: [],
  templateUrl: './nde-fetch-item-journal-option-hider.component.html',
  styleUrl: './nde-fetch-item-journal-option-hider.component.scss'
})
export class NdeFetchItemJournalOptionHiderComponent {
  ngOnInit(): void {
    document.querySelectorAll('mat-radio-button').forEach((tag) => {
      if (tag.innerHTML.indexOf('journal') > 0) {
        tag.setAttribute("style", "display: none;")
      }
    });
  }
}
