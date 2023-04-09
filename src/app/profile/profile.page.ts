import {Component, OnInit} from '@angular/core';
import {ViewWillEnter} from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, ViewWillEnter {

  constructor() {
  }

  ngOnInit() {
    console.log('executei o onInit do profile');
  }

  ionViewWillEnter(): void {
    console.log('executei o ionViewWillEnter do profile');
  }

}
