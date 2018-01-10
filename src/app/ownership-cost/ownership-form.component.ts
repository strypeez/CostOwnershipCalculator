import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {AuthService} from '../auth/auth.service';
import {NavigationEnd, Router} from '@angular/router';
import {current} from 'codelyzer/util/syntaxKind';
/**
 * Created by Eiston on 7/5/2017.
 */
@Component({
  templateUrl: './ownership-form.component.html',
})

export class OwnershipFormComponent implements OnInit {
  uid: string;
  router: Router;
  newtype: string;
  newcost: number;
  onetime: boolean;
  addbutton: boolean;
  nextbutton: boolean;
  date: number;
  items: FirebaseListObservable<any>;
  answerdata: FirebaseListObservable<any>;
  submittedItems: FirebaseListObservable<any>;
  submitted: FirebaseObjectObservable<any>;
  constants: FirebaseObjectObservable<any>;
  submitCount: number;
  dataSubmit = [];
  cons = {
    valveNumber: 1,
    MTBF: 6,
    failPercent: 3,
    opportunityCost: 5
  };
  constructor( public authService: AuthService, db: AngularFireDatabase, private _router: Router) {
    this.submitCount = 0;
    this.router = _router
    this.date = Math.floor(Date.now() / 10000000);
    console.log(Date.now() / 10000000);
    this.authService.user.subscribe(
      (auth) => {
        if (auth == null) {
          console.log('Not Logged in.');
          this.router.navigate(['signin']);
        } else {
          this.uid = auth.uid;
          console.log('/quote/answers/' + this.uid);
          this.constants = db.object('/ownership/answers/' + this.uid + '/' + this.date + '/constants');
          this.submitted = db.object('/ownership/answers/' + this.uid + '/' + this.date + '/submitted');
          this.submittedItems = db.list('/ownership/answers/' + this.uid + '/' + this.date + '/submitted');
          this.answerdata = db.list('/ownership/answers/' + this.uid + '/data');
          this.answerdata.remove();
          this.items = db.list('/ownership/questions');
          this.submittedItems.subscribe(items => {
            items.forEach(item => {
              this.answerdata.push({ type: item.type, otc: item.otc, amount: item.amount, desc: item.desc});
              this.submitCount ++;
            });
            console.log(this.submitCount);
            if (this.submitCount === 0) {
              this.items.subscribe(things => {
                things.forEach(thing => {
                  this.answerdata.push({ type: thing.type, otc: thing.otc, amount: thing.amount, desc: thing.desc});
                })
              });
            } else {
              this.constants.subscribe(constants => {
                this.cons.valveNumber = constants.valveNumber;
                this.cons.MTBF = constants.MTBF;
                this.cons.failPercent = constants.failPercent;
                this.cons.opportunityCost = constants.opportunityCost;
              });
            }
          });
        }
      }
    );
    this.onetime = false;
    this.addbutton = true;
    this.nextbutton = true;
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
  submitAnswer(key: string, answer: number) {
    if (answer) {
       this.answerdata.update(key, { amount: answer });
    }
  }
  addForm() {
    this.answerdata.push({type: this.newtype, amount: this.newcost, otc: this.onetime, desc: '1' });
    this.newtype = '';
    this.newcost = null;
    this.onetime = true;
    this.addbutton = true;
  }
  submitForm() {
    this.answerdata.subscribe(items => {
      items.forEach(item => {
        this.dataSubmit.push({type: item.type, amount: item.amount, otc: item.otc, desc: item.desc});
      })
    })
    this.constants.set(this.cons);
    this.submitted.set(this.dataSubmit);

  }

}
