import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';

import { Router } from '@angular/router';

@Component({
  selector: 'app-bottom-bar',
  templateUrl: './bottom-bar.component.html',
  styleUrls: ['./bottom-bar.component.css']
})
export class BottomBarComponent implements OnInit {
  gitURL: string;

  constructor(
  ) { }

  ngOnInit() {
    this.gitURL = environment.git_url;
  }

}
