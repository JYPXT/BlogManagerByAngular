import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private isCollapsed = false;
  private triggerTemplate = null;

  private nick: string;

  @ViewChild('trigger') customTrigger: TemplateRef<void>;

  constructor() { }

  ngOnInit() {
    this.nick = window.sessionStorage.getItem('nick');
  }

  /** custom trigger can be TemplateRef **/
  changeTrigger(): void {
    this.triggerTemplate = this.customTrigger;
  }

}
