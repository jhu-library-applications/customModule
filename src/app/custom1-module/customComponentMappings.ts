import { NdeSearchBarContainerCustomComponent } from "../nde-search-bar-container-custom/nde-search-bar-container-custom.component";
import { NdeRequestFormCustomComponent } from "../nde-request-form-custom/nde-request-form-custom.component";

// Define the map
export const selectorComponentMap = new Map<string, any>([
  ["nde-formly-general-wrapper-bottom", NdeRequestFormCustomComponent],
  ["nde-search-bar-container-top", NdeSearchBarContainerCustomComponent],
]);
