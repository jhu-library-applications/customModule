import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'custom-nde-sais-eu-custom-background',
  templateUrl: './nde-sais-eu-custom-background.component.html',
  styleUrls: ['./nde-sais-eu-custom-background.component.scss']
})
export class NdeSaisEuCustomBackgroundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let topBarElement: HTMLElement = document.querySelector('.top-bar-background-image') as HTMLElement;
    topBarElement.setAttribute('style', 'background-image: url(/custom/01JHU_INST-sais_europe_nde/assets/images/bolognabanner1.jpg);');
  }

}
