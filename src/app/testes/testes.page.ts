import {Component, OnInit} from '@angular/core';
import {BackgroundMode} from '@awesome-cordova-plugins/background-mode/ngx';

@Component({
  selector: 'app-testes',
  templateUrl: './testes.page.html',
  styleUrls: ['./testes.page.scss'],
})
export class TestesPage implements OnInit {

  constructor(
    private backgroundMode: BackgroundMode,
  ) {
  }

  ngOnInit() {

  }

  execute() {
    // this.backgroundMode.unlock();
    this.backgroundMode.enable();
    this.backgroundMode.configure({silent: true});
    this.backgroundMode.disableWebViewOptimizations();
    this.backgroundMode.moveToBackground();
    this.backgroundMode.excludeFromTaskList();
  }
}
