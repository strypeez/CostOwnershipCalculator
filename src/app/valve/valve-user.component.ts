import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {AuthService} from '../auth/auth.service';
import {Router} from '@angular/router';
import {ValveAddComponent} from './valve-add.component';
import {Observable} from 'rxjs/Observable';
@Component({
  selector: 'app-valve-user',
  templateUrl: 'valve-user.component.html'
})
export class ValveUserComponent implements OnChanges {
  @Input() valves = [];
  ngOnChanges(changes: SimpleChanges) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur  = JSON.stringify(chng.currentValue);
      console.log('/valves/' + cur);
    }
  }
}
