import {Component} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {Router} from '@angular/router';
import {AsyncSubject} from 'rxjs/AsyncSubject';
import {Observable} from 'rxjs/Observable';
@Component({
  selector: 'app-valve-add',
  templateUrl: 'valve-add.component.html'
})
export class ValveAddComponent {
  users: FirebaseListObservable<any>;
  valves: FirebaseListObservable<any>;
  selected = [];
  constructor(public authService: AuthService, db: AngularFireDatabase, private router: Router ) {
    this.users = db.list('/users');
    this.valves = db.list('/valves');
  };
  selectuser(uid: string) {
    this.valves.subscribe(valves => {
      valves.forEach(valve => {
        if (valve.$key === uid) {
          valve.forEach(item => {
            this.selected.push(item);
          })
        }
      })
    });
  }
  newvalve(uid: string, db: AngularFireDatabase) {
    this.valves.$ref.ref.child(uid).push({serial: '0'});
  }

}

