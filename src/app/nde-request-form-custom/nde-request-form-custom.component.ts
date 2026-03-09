import {
  Component,
  Input,
  inject,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "custom-nde-request-form-custom",
  standalone: true,
  imports: [],
  templateUrl: "./nde-request-form-custom.component.html",
  styleUrl: "./nde-request-form-custom.component.scss",
})
export class NdeRequestFormCustomComponent implements OnInit, OnDestroy {
  @Input() private hostComponent!: any;

  private store = inject(Store);
  private destroy$ = new Subject<void>();

  private patronStatusCode = "";
  private currentPickupLocation = "";
  private checkboxSelectors = [
    '[data-qa="almaRequest.genericCheckBox"]',
    'formly-field[data-qa="almaRequest.genericCheckBox"]',
    "#form_field_genericCheckBox",
    "#form_field_checkbox_genericCheckBox",
  ];

  private readonly ELIGIBLE_HOMEWOOD_GROUPS = ["jhfac", "jhgrad", "jhstf", "jhsrstf"];
  private readonly ELIGIBLE_WELCH_GROUPS = ["jhfac"];

  ngOnInit(): void {
    this.hideCheckboxInitially();
    this.initializeUserData();
    this.monitorPickupLocationChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private hideCheckboxInitially(): void {
    setTimeout(() => {
      const checkbox = this.findCheckboxElement();
      if (checkbox) {
        checkbox.style.display = "none";
      } else {
        setTimeout(() => this.hideCheckboxInitially(), 500);
      }
    }, 100);
  }

  private findCheckboxElement(): HTMLElement | null {
    for (const selector of this.checkboxSelectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element) return element;
    }
    return null;
  }

  private initializeUserData(): void {
    this.store.pipe(takeUntil(this.destroy$)).subscribe((state: any) => {
      if (state?.user?.decodedJwt) {
        this.patronStatusCode = state.user.decodedJwt.userGroup || "";

        if (this.currentPickupLocation) {
          this.updateCheckboxVisibility(this.currentPickupLocation);
        }
      }
    });
  }

  private monitorPickupLocationChanges(): void {
    const pickupInput = document.querySelector(
      '[data-qa="almaRequest.pickupLocation"] input'
    ) as HTMLInputElement;

    if (pickupInput) {
      pickupInput.addEventListener("input", () => this.checkPickupLocationChange());
      pickupInput.addEventListener("change", () => this.checkPickupLocationChange());

      const observer = new MutationObserver(() => this.checkPickupLocationChange());
      observer.observe(pickupInput, {
        attributes: true,
        attributeFilter: ["value"],
      });
    }

    // Fallback polling
    setInterval(() => this.checkPickupLocationChange(), 2000);
  }

  private checkPickupLocationChange(): void {
    const pickupInput = document.querySelector(
      '[data-qa="almaRequest.pickupLocation"] input'
    ) as HTMLInputElement;

    if (pickupInput) {
      const newValue = pickupInput.value?.trim() || "";

      if (newValue !== this.currentPickupLocation) {
        this.currentPickupLocation = newValue;
        this.updatePickupNotice(newValue);
        this.updateCheckboxVisibility(newValue);
      }
    }
  }

  private updatePickupNotice(selectedLocation: string): void {
    const pickupNotice = document.getElementById("pickup-notice");

    if (pickupNotice) {
      pickupNotice.style.display = selectedLocation.includes("Eisenhower")
        ? "block"
        : "none";
    }
  }

  private updateCheckboxVisibility(selectedLocation: string): void {
    if (!this.patronStatusCode) return;

    const checkbox = this.findCheckboxElement();
    if (!checkbox) return;

    const isEligible = this.isEligibleForDelivery(selectedLocation);
    checkbox.style.display = isEligible ? "block" : "none";

    if (isEligible) {
      this.updateCheckboxLabel(selectedLocation);
    }
  }

  private isEligibleForDelivery(selectedLocation: string): boolean {
    if (selectedLocation.includes("Eisenhower")) {
      return this.ELIGIBLE_HOMEWOOD_GROUPS.includes(this.patronStatusCode);
    }

    if (selectedLocation.includes("Welch")) {
      return this.ELIGIBLE_WELCH_GROUPS.includes(this.patronStatusCode);
    }

    return false;
  }

  private updateCheckboxLabel(selectedLocation: string): void {
    const labelSelectors = [
      '[data-qa="almaRequest.genericCheckBox"] label',
      '[data-qa="almaRequest.genericCheckBox"] span',
      '[data-qa="almaRequest.genericCheckBox"] .mat-mdc-checkbox-label',
    ];

    for (const selector of labelSelectors) {
      const label = document.querySelector(selector);
      if (label) {
        if (selectedLocation.includes("Eisenhower")) {
          label.textContent = "Office Delivery (Please include your Campus Mailbox Address in the Comment section)";
        } else if (selectedLocation.includes("Welch")) {
          label.textContent = "Office Delivery (Please include your Office Address in the Comment Section)";
        }
        break;
      }
    }
  }
}
