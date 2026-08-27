import {
  Component,
  inject,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import {
  createAction,
  createFeatureSelector,
  createSelector,
  props,
  Store
} from '@ngrx/store';

import { SHELL_ROUTER } from '../injection-tokens';

@Component({
  selector: 'custom-nde-subjects-custom',
  standalone: true,
  imports: [],
  templateUrl: './nde-subjects-custom.component.html',
  styleUrl: './nde-subjects-custom.component.scss'
})

/*

Inspired by:
https://github.com/project-kotinos/trln___trln_argon/blob/d9507509d8e86da5f81df3993dc402b3953623a4/lib/trln_argon/view_helpers/subjects_helper.rb

*/
export class NdeSubjectsCustomComponent implements AfterViewInit, OnDestroy {
  private router = inject(SHELL_ROUTER);
  private store = inject(Store);

  private observer?: MutationObserver;

  private selectUserFeature = createFeatureSelector<{ displaySummary: boolean }>('Search');

  private displaySummary = createSelector(
    this.selectUserFeature,
    state => state.displaySummary
  );

  private displaySummarySelected = this.store.selectSignal(this.displaySummary);

  private setDisplaySummary = createAction(
    '[Search] Set Display Summary',
    props<{ displaySummary: boolean }>()
  );

  hasClass(target: EventTarget | null, className: string): boolean {
    return target instanceof Element && target.classList.contains(className);
  }

  mouseOverOverride = (e: Event) => {
    const isHierarchySubject = this.hasClass(e.target, 'hierarchy-subject');

    if (isHierarchySubject) {
      const siblings = this.getPreviousSiblings(e.target as HTMLElement);

      siblings.forEach((sibling) => {
        sibling.style.textDecoration = 'underline';
      });
    }
  };

  mouseOutOverride = (e: Event) => {
    const isHierarchySubject = this.hasClass(e.target, 'hierarchy-subject');

    if (isHierarchySubject) {
      const siblings = this.getPreviousSiblings(e.target as HTMLElement);

      siblings.forEach((sibling) => {
        sibling.style.textDecoration = '';
      });
    }
  };

  clickOverride = (e: Event) => {
    if (this.hasClass(e.target, 'hierarchy-subject')) {
      e.preventDefault();

      const link = (e.target as HTMLAnchorElement).getAttribute('href');

      if (!link) {
        return;
      }

      this.store.dispatch(
        this.setDisplaySummary({
          displaySummary: true
        })
      );

      this.router.navigateByUrl(link.replace('/nde/', '/'), {
        replaceUrl: true
      });
    }
  };

  getPreviousSiblings(el: HTMLElement): HTMLElement[] {
    const ret: HTMLElement[] = [];
    let n: Element | null = el;

    while ((n = n.previousElementSibling)) {
      ret.push(n as HTMLElement);
    }

    return ret;
  }

  processSubjects() {
    const zip = (a: string[], b: string[]) => {
      return a.map((k, i) => [k, b[i]]);
    };

    const allSubjects = document.querySelectorAll(
      '[data-qa="detail_subject"] .hyper-text:not(.hierarchy-subject)'
    ) as NodeListOf<HTMLElement>;

    allSubjects.forEach((el) => {
      const originalText = el.innerText.trim();

      if (!originalText) {
        return;
      }

      if (!originalText.includes(' -- ')) {
        return;
      }

      const hierarchy: string[] = [];
      const subjects = originalText.split(' -- ');

      subjects.forEach((subject, index) => {
        if (hierarchy[index - 1] !== undefined) {
          hierarchy.push(`${hierarchy[index - 1]} -- ${subject}`);
        } else {
          hierarchy.push(subject);
        }
      });

      const zippedSubjects = zip(subjects, hierarchy);
      const linkedSubjects: string[] = [];

      zippedSubjects.forEach((subjectPair) => {
        const label = subjectPair[0];
        const fullHierarchySubject = subjectPair[1];

        const encodedSearchTerm = fullHierarchySubject.replaceAll(',', '─');

        const searchPath =
          `/nde/search?query=sub,contains,${encodedSearchTerm}` +
          `&mode=advanced&tab=advanced&vid=01JHU_INST:nde`;

        linkedSubjects.push(`
          <a class="hyper-text hierarchy-subject mat-body-medium" href="${searchPath}">
            ${label}
          </a>
        `);
      });

      el.outerHTML = linkedSubjects.join(' -- ');
    });
  }

  initBehavior() {
    document.addEventListener('mouseover', this.mouseOverOverride);
    document.addEventListener('mouseout', this.mouseOutOverride);
    document.addEventListener('click', this.clickOverride);
  }

  ngAfterViewInit() {
    this.processSubjects();
    this.initBehavior();

    this.observer = new MutationObserver(() => {
      this.processSubjects();
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  ngOnDestroy() {
    document.removeEventListener('mouseover', this.mouseOverOverride);
    document.removeEventListener('mouseout', this.mouseOutOverride);
    document.removeEventListener('click', this.clickOverride);

    this.observer?.disconnect();
  }
}
