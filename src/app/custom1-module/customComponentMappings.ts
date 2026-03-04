import { NdeSearchBarContainerCustomComponent } from "../nde-search-bar-container-custom/nde-search-bar-container-custom.component";
import { NdeSearchNoResultsCustomComponentComponent } from "../nde-search-no-results-custom-component/nde-search-no-results-custom-component.component";

// Define the map
export const selectorComponentMap = new Map<string, any>([
  ["nde-search-bar-container-top", NdeSearchBarContainerCustomComponent],
  ["nde-search-no-results-top", NdeSearchNoResultsCustomComponentComponent]
]);
