import {
  Component,
  Input,
  inject,
  OnInit,
  OnDestroy,
  Renderer2,
  ElementRef,
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
  private renderer = inject(Renderer2);
  private elementRef = inject(ElementRef);
  private destroy$ = new Subject<void>();

  private patronStatusCode = "";
  private currentPickupLocation = "";

  // Updated Location IDs using library names
  private readonly EISENHOWER_ID = "Milton S. Eisenhower Library";
  private readonly HOMEWOOD_ID = "Milton S. Eisenhower Library"; // Same as Eisenhower
  private readonly WELCH_ID = "William H. Welch Medical Library";

  // Eligible groups
  private readonly ELIGIBLE_HOMEWOOD_GROUPS = [
    "jhfac",
    "jhgrad",
    "jhstf",
    "jhsrstf",
  ];
  private readonly ELIGIBLE_WELCH_GROUPS = ["jhfac"];

  ngOnInit(): void {
    console.log("=== NdeRequestFormCustomComponent Initializing ===");
    this.hideCheckboxInitially();
    this.initializeUserData();
    this.monitorPickupLocationChanges();
    this.logAvailableDropdownOptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private hideCheckboxInitially(): void {
    console.log("=== Hiding checkbox initially ===");

    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const selectors = [
        '[data-qa="almaRequest.genericCheckBox"]',
        'formly-field[data-qa="almaRequest.genericCheckBox"]',
        '.form-checkbox[data-qa="almaRequest.genericCheckBox"]',
        "#form_field_genericCheckBox",
        "#form_field_checkbox_genericCheckBox",
      ];

      let checkboxElement: Element | null = null;

      for (const selector of selectors) {
        checkboxElement = document.querySelector(selector);
        if (checkboxElement) {
          console.log(
            `Initial hide: Found checkbox using selector: ${selector}`,
          );
          (checkboxElement as HTMLElement).style.display = "none";
          console.log("Checkbox initially hidden");
          break;
        }
      }

      if (!checkboxElement) {
        console.log("Initial hide: Checkbox element not found in DOM");
        // Try again after a longer delay
        setTimeout(() => this.hideCheckboxInitially(), 500);
      }
    }, 100);
  }

  private logAvailableDropdownOptions(): void {
    console.log("=== Logging available dropdown options ===");

    setTimeout(() => {
      // Try to find dropdown options
      const dropdownSelectors = [
        '[data-qa="almaRequest.pickupLocation"] mat-option',
        "mat-autocomplete mat-option",
        ".mat-mdc-option",
        "mat-option",
      ];

      for (const selector of dropdownSelectors) {
        const options = document.querySelectorAll(selector);
        if (options.length > 0) {
          console.log(
            `Found ${options.length} dropdown options using selector: ${selector}`,
          );
          options.forEach((option, index) => {
            console.log(`Option ${index + 1}:`, {
              textContent: option.textContent?.trim(),
              value: (option as any).value,
              innerHTML: option.innerHTML,
            });
          });
          break;
        }
      }

      // Also try to trigger dropdown to see options
      const inputElement = document.querySelector(
        '[data-qa="almaRequest.pickupLocation"] input',
      ) as HTMLInputElement;
      if (inputElement) {
        console.log("Current input value:", inputElement.value);
        console.log("Input element attributes:", {
          id: inputElement.id,
          name: inputElement.name,
          value: inputElement.value,
          placeholder: inputElement.placeholder,
        });
      }
    }, 1000);
  }

  private initializeUserData(): void {
    console.log("=== Initializing user data ===");

    this.store.pipe(takeUntil(this.destroy$)).subscribe((state) => {
      console.log("Full store state:", state);

      if (state && (state as any).user) {
        console.log("User state:", (state as any).user);

        if ((state as any).user.decodedJwt) {
          const jwt = (state as any).user.decodedJwt;
          console.log("User decoded JWT:", jwt);

          this.patronStatusCode = jwt.userGroup || "";
          console.log("Extracted patronStatusCode:", this.patronStatusCode);
          console.log("Available JWT properties:", Object.keys(jwt));

          // Update checkbox visibility if we already have a pickup location
          if (this.currentPickupLocation) {
            console.log(
              "Updating checkbox visibility for existing location:",
              this.currentPickupLocation,
            );
            this.updateCheckboxVisibility(this.currentPickupLocation);
          }
        } else {
          console.log("No decodedJwt found in user state");
        }
      } else {
        console.log("No user state found");
      }
    });

    console.log("Host component:", this.hostComponent);
  }

  private monitorPickupLocationChanges(): void {
    console.log("=== Starting pickup location monitoring ===");

    // Use MutationObserver to watch for changes in the pickup location field
    const pickupLocationElement = document.querySelector(
      '[data-qa="almaRequest.pickupLocation"] input',
    );

    if (pickupLocationElement) {
      console.log(
        "Found pickup location input element:",
        pickupLocationElement,
      );

      // Watch for value changes
      const observer = new MutationObserver((mutations) => {
        console.log("MutationObserver triggered:", mutations);
        this.checkPickupLocationChange();
      });

      // Listen for input events
      pickupLocationElement.addEventListener("input", (event) => {
        console.log("Input event triggered:", event);
        this.checkPickupLocationChange();
      });

      pickupLocationElement.addEventListener("change", (event) => {
        console.log("Change event triggered:", event);
        this.checkPickupLocationChange();
      });

      // Also observe attribute changes
      observer.observe(pickupLocationElement, {
        attributes: true,
        attributeFilter: ["value"],
        childList: true,
        subtree: true,
      });
    } else {
      console.log("Pickup location input element not found initially");
    }

    // Fallback: periodically check for changes
    setInterval(() => {
      this.checkPickupLocationChange();
    }, 2000);
  }

  private checkPickupLocationChange(): void {
    // Try to get the selected pickup location value
    const pickupInput = document.querySelector(
      '[data-qa="almaRequest.pickupLocation"] input',
    ) as HTMLInputElement;

    if (pickupInput) {
      const newValue = pickupInput.value?.trim() || "";

      if (newValue !== this.currentPickupLocation) {
        console.log("=== Pickup location changed ===");
        console.log("Previous value:", this.currentPickupLocation);
        console.log("New value:", newValue);
        console.log("Input element properties:", {
          value: pickupInput.value,
          textContent: pickupInput.textContent,
          innerText: pickupInput.innerText,
          dataset: pickupInput.dataset,
        });

        this.currentPickupLocation = newValue;
        this.updatePickupNotice(newValue);
        this.updateCheckboxVisibility(newValue);
      }
    } else {
      // Try alternative selectors for the input
      const alternativeSelectors = [
        '[data-qa="almaRequest.pickupLocation"] .mat-mdc-input-element',
        'formly-field[data-qa="almaRequest.pickupLocation"] input',
        ".pickup-location-input",
      ];

      for (const selector of alternativeSelectors) {
        const element = document.querySelector(selector) as HTMLInputElement;
        if (element) {
          console.log(
            `Found pickup input using alternative selector: ${selector}`,
            element.value,
          );
          break;
        }
      }
    }
  }

  private updatePickupNotice(selectedLocationId: string): void {
    console.log("=== Updating pickup notice ===");
    console.log("Selected location:", selectedLocationId);
    console.log("Eisenhower ID:", this.EISENHOWER_ID);
    console.log(
      "Location matches Eisenhower:",
      selectedLocationId === this.EISENHOWER_ID,
    );

    const pickupNotice = document.getElementById("pickup-notice");

    if (pickupNotice) {
      if (
        selectedLocationId === this.EISENHOWER_ID ||
        selectedLocationId.includes("Eisenhower")
      ) {
        pickupNotice.style.display = "block";
        console.log("Pickup notice shown");
      } else {
        pickupNotice.style.display = "none";
        console.log("Pickup notice hidden");
      }
    } else {
      console.log("Pickup notice element not found");
    }
  }

  private campusDeliveryEligible(
    patronStatusCode: string,
    selectedLocationId: string,
  ): boolean {
    console.log("=== Checking campus delivery eligibility ===");
    console.log("Patron status code:", patronStatusCode);
    console.log("Selected location:", selectedLocationId);
    console.log("Homewood ID:", this.HOMEWOOD_ID);
    console.log("Welch ID:", this.WELCH_ID);
    console.log("Eligible Homewood groups:", this.ELIGIBLE_HOMEWOOD_GROUPS);
    console.log("Eligible Welch groups:", this.ELIGIBLE_WELCH_GROUPS);

    if (
      selectedLocationId === this.HOMEWOOD_ID ||
      selectedLocationId.includes("Eisenhower")
    ) {
      console.log("Location is Homewood/Eisenhower");
      this.updateCheckboxLabel(
        "Office Delivery (Please include your Campus Mailbox Address in the Comment section)",
      );
      const isEligible =
        this.ELIGIBLE_HOMEWOOD_GROUPS.includes(patronStatusCode);
      console.log("Homewood eligibility result:", isEligible);
      return isEligible;
    }

    if (
      selectedLocationId === this.WELCH_ID ||
      selectedLocationId.includes("Welch")
    ) {
      console.log("Location is Welch");
      this.updateCheckboxLabel(
        "Office Delivery (Please include your Office Address in the Comment Section)",
      );
      const isEligible = this.ELIGIBLE_WELCH_GROUPS.includes(patronStatusCode);
      console.log("Welch eligibility result:", isEligible);
      return isEligible;
    }

    console.log("Location doesn't match any eligible libraries");
    return false;
  }

  private updateCheckboxLabel(labelText: string): void {
    console.log("=== Updating checkbox label ===");
    console.log("New label text:", labelText);

    // Try multiple selectors to find the checkbox label
    const labelSelectors = [
      '[data-qa="almaRequest.genericCheckBox"] .mat-mdc-checkbox-label',
      '[data-qa="almaRequest.genericCheckBox"] label',
      '[data-qa="almaRequest.genericCheckBox"] span',
      "#form_field_checkbox_genericCheckBox label",
      "mat-checkbox label",
      'formly-field[data-qa="almaRequest.genericCheckBox"] label',
    ];

    let labelElement: Element | null = null;

    for (const selector of labelSelectors) {
      labelElement = document.querySelector(selector);
      if (labelElement) {
        console.log(`Found checkbox label using selector: ${selector}`);
        console.log("Current label text:", labelElement.textContent);
        break;
      }
    }

    if (labelElement) {
      labelElement.textContent = labelText;
      console.log("Updated checkbox label to:", labelText);
    } else {
      console.log("Checkbox label element not found");
      console.log("Available elements with 'checkbox' in selector:");
      document
        .querySelectorAll(
          '*[*|*="*checkbox*"], *[class*="checkbox"], *[id*="checkbox"]',
        )
        .forEach((el) => {
          console.log("Found checkbox-related element:", el);
        });
    }
  }

  private updateCheckboxVisibility(selectedLocationId: string): void {
    console.log("=== Updating checkbox visibility ===");
    console.log("Selected location:", selectedLocationId);
    console.log("Patron status code:", this.patronStatusCode);

    if (!this.patronStatusCode) {
      console.log("Patron status code not available yet - hiding checkbox");
      return;
    }

    // Try multiple selectors to find the checkbox
    const selectors = [
      '[data-qa="almaRequest.genericCheckBox"]',
      'formly-field[data-qa="almaRequest.genericCheckBox"]',
      '.form-checkbox[data-qa="almaRequest.genericCheckBox"]',
      "#form_field_genericCheckBox",
      "#form_field_checkbox_genericCheckBox",
    ];

    let checkboxElement: Element | null = null;

    for (const selector of selectors) {
      checkboxElement = document.querySelector(selector);
      if (checkboxElement) {
        console.log(`Found checkbox using selector: ${selector}`);
        break;
      }
    }

    if (checkboxElement) {
      const isEligible = this.campusDeliveryEligible(
        this.patronStatusCode,
        selectedLocationId,
      );

      if (isEligible) {
        (checkboxElement as HTMLElement).style.display = "block";
        console.log("✅ Checkbox shown - user is eligible");
      } else {
        (checkboxElement as HTMLElement).style.display = "none";
        console.log("❌ Checkbox hidden - user not eligible");
      }
    } else {
      console.log("❌ Checkbox element not found in DOM");
      console.log("Available form elements:");
      document
        .querySelectorAll('formly-field, mat-checkbox, input[type="checkbox"]')
        .forEach((el, index) => {
          console.log(`Form element ${index + 1}:`, {
            tagName: el.tagName,
            className: el.className,
            id: el.id,
            dataset: (el as HTMLElement).dataset,
          });
        });
    }
  }
}
