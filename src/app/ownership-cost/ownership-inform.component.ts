import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {Component, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {NavigationEnd, Router} from '@angular/router';
/**
 * Created by Eiston on 8/11/2017.
 */

@Component({
  templateUrl: './ownership-inform.component.html',
})

export class OwnershipInformComponent implements OnInit {
  process: FirebaseObjectObservable<any>;
  option: FirebaseObjectObservable<any>;
  uid: string;
  date: number;
  processes = {
    media : {
      Corrosive: false,
      Abrasive: false,
      HardensClogs: false,
    },
    temperature: {
      operating: 0,
      max: 0,
      units: '',
    },
    pressure: {
      operating: 0,
      max: 0,
      units: '',
    },
    areaClassification: '',
    numberOfCycles: {
      Minute: 0,
      Hour: 0,
      Day: 0,
      Year: 0
    },
  };
  options = {
    Type : {
      Ball: false,
      Butterfly: false,
      Globe: false,
      other: false,
    },
    Size: '',
    EndConnections : '',
    drive : {
      Gearbox: false,
      DoubleActingActuator: false,
      SpringReturnActuator: false,
      LimitSwitch: false,
      Solenoid: false,
      Positioner: false,
      Other: false,
    },
    otherDesc: '',
  };
  constructor(public authService: AuthService, db: AngularFireDatabase, private router: Router) {
    this.date = Math.floor(Date.now() / 10000000);
    this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          console.log('Not Logged in.');
          this.router.navigate(['signin']);
        } else {
          this.uid = auth.uid;
          this.process = db.object('/ownership/answers/' + this.uid + '/' + this.date + '/process');
          this.option = db.object('/ownership/answers/' + this.uid + '/' + this.date + '/option');
        }
      })

  }
  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
  submitinfo() {
    this.process.set(this.processes);
    this.option.set(this.options);
  }
}
