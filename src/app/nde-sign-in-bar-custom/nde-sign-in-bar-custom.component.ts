import { Component, inject } from '@angular/core';
import { createFeatureSelector, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
type user = { isLoggedIn: boolean };
export const isLoggedInState = createFeatureSelector<user>('user');
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'custom-nde-sign-in-bar-custom',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIcon],
  templateUrl: './nde-sign-in-bar-custom.component.html',
  styleUrl: './nde-sign-in-bar-custom.component.scss'
})
export class NdeSignInBarCustomComponent {
  public store = inject(Store);



  isLoggedIn: boolean = false;
  isLoggedInState$: Observable<user> | undefined;
  dismissed: boolean = false;

  dismiss() {
    this.dismissed = true;
  }
  
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
