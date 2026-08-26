import { Component, inject, AfterContentInit } from '@angular/core';
import { SHELL_ROUTER } from "../injection-tokens";
import { createAction, createFeatureSelector, createSelector, props, Store } from '@ngrx/store';

@Component({
  selector: 'custom-nde-subjects-custom',
  standalone: true,
  imports: [],
  templateUrl: './nde-subjects-custom.component.html',
  styleUrl: './nde-subjects-custom.component.scss'
})

/* 

Inspired by https://github.com/project-kotinos/trln___trln_argon/blob/d9507509d8e86da5f81df3993dc402b3953623a4/lib/trln_argon/view_helpers/subjects_helper.rb


*/
export class NdeSubjectsCustomComponent implements AfterContentInit {
  private router = inject(SHELL_ROUTER);
  private store = inject(Store);


  hasClass(target: EventTarget | null, className: string) {
    return ((<Element>target)?.classList && (<Element>target)?.classList.contains(className))
  }

  mouseOverOverride(e: Event) {
    const isHierarchySubject: boolean = this?.hasClass(e.target, 'hierarchy-subject');
    if (isHierarchySubject) {
      var siblings = this.getPreviousSiblings((e.target as HTMLInputElement))
      siblings.forEach((sibling) => {
        (sibling as HTMLInputElement).style.textDecoration = "underline"
      })
    }
  }

  mouseOutOverride(e: Event) {
    const isHierarchySubject: boolean = this?.hasClass(e.target, 'hierarchy-subject');

    if (isHierarchySubject) {
      var siblings = this.getPreviousSiblings((e.target as HTMLInputElement))
      siblings.forEach((sibling) => {
        (sibling as HTMLInputElement).style.textDecoration = ""
      })
    }
  }

  getPreviousSiblings(el: any) {
    var n = el, ret = [];
    while (n = n.previousElementSibling) {
      ret.push(n)
    }
    return ret;
  }


  processSubjects() {
    const zip = (a: any[], b: { [x: string]: any; }) => a.map((k: any, i: string | number) => [k, b[i]]);

    const allSubjects = document.querySelectorAll('[data-qa="detail_subject"] .hyper-text') as NodeListOf<HTMLInputElement>;

    allSubjects.forEach((el) => {
      var hierarchy: any = []

      var subjects = el.innerText.split(' -- ');

      el.innerText.split(' -- ').forEach((subject, index) => {
        if (hierarchy[index - 1] != undefined) {
          hierarchy.push(hierarchy[index - 1] + " -- " + subject)
        } else {
          hierarchy.push(subject)
        }

      })

      const zipped_subjects = zip(subjects, hierarchy)
      const linked_subjects: any = [];

      zipped_subjects.forEach((subject_pair) => {
        const encodedSearchTerm = subject_pair[1].replaceAll(',', '─');

        const searchPath = `/nde/search?query=sub,contains,${encodedSearchTerm}&mode=advanced&tab=advanced&vid=01JHU_INST:nde`;
        linked_subjects.push(`
          <a class="hyper-text hierarchy-subject mat-body-medium" href="${searchPath}">
   
                 ${subject_pair[0]}

          </a>
          `);
      })

      el.outerHTML = linked_subjects.join(' -- ')
    })
  }

  initBehavior() {
    const store = this.store;
    const router = this.router;
    const hasClass = this.hasClass
    const mouseOverOverride = this.mouseOverOverride;
    const mouseOutOverride = this.mouseOutOverride;
    const selectUserFeature = createFeatureSelector<{ displaySummary: boolean }>('Search');
    const displaySummary = createSelector(selectUserFeature, state => state.displaySummary);
    const displaySummarySelected = this.store.selectSignal(displaySummary);
    const setDisplaySummary = createAction(
      '[Search] Set Display Summary',
      props<{ displaySummary: boolean }>()
    );

    document.addEventListener('mouseover', function (e) {
      mouseOverOverride(e);
    })

    document.addEventListener('mouseout', function (e) {
      mouseOutOverride(e);
    })

    document.addEventListener('click', function (e) {
      if (hasClass(e.target, 'hierarchy-subject')) {
        e.preventDefault();

        const link = (e.target as HTMLInputElement).getAttribute('href') as string
        store.dispatch(setDisplaySummary({ displaySummary: true }));
        router.navigateByUrl(link.replace('/nde/', '/'), {
          replaceUrl: true
        })
      }
    })
  }

  ngAfterContentInit() {
    this.processSubjects();
    this.initBehavior();
  }



  ngOnDestroy() {
    const customSubjects = document.querySelectorAll('.hierarchy-subject');
    customSubjects.forEach((e: Element) => {
      console.log("Removing!")
      e.removeEventListener('mouseover', this.mouseOverOverride);
      e.removeEventListener('mouseout', this.mouseOutOverride);
    })
  }
}
