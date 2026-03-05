import { NdeSearchBarContainerCustomComponent } from "../nde-search-bar-container-custom/nde-search-bar-container-custom.component";
import { NdeSearchHintCustomComponent } from "../nde-search-hint-custom/nde-search-hint-custom.component";
import { NdeSearchNoResultsCustomComponent } from "../nde-search-no-results-custom/nde-search-no-results-custom.component";

// Define the map
export const selectorComponentMap = new Map<string, any>([
  ["nde-search-bar-container-top", NdeSearchBarContainerCustomComponent],
  ["nde-search-no-results-top", NdeSearchNoResultsCustomComponent],
  ["nde-search-results-container-top", NdeSearchHintCustomComponent ]
]);
