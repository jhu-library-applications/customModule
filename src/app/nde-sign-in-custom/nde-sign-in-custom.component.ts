import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createFeatureSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

type user = { isLoggedIn: boolean };
export const isLoggedInState = createFeatureSelector<user>('user');

@Component({
  selector: 'custom-nde-sign-in-custom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nde-sign-in-custom.component.html',
  styleUrl: './nde-sign-in-custom.component.scss'
})

export class NdeSignInCustomComponent implements OnInit {
  public store = inject(Store);

  isLoggedIn: boolean = false;
  isLoggedInState$: Observable<user> | undefined;

  ngOnInit() {
    this.isLoggedInState$ = this.store.select(isLoggedInState);
    this.isLoggedInState$.subscribe((u) => {
      this.isLoggedIn = u.isLoggedIn;
    })
    console.log(this.isLoggedIn)

  }

  triggerSignInPopUp() {
    (document.querySelector('#user-area-button') as HTMLInputElement).click();
    (document.querySelector('[aria-label=" Sign In"]') as HTMLInputElement).click();
  }

}
