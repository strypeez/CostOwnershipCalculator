/**
 * Created by Eiston on 7/5/2017.
 */
import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable} from 'angularfire2/database';
import {AuthService} from '../auth/auth.service';
import {NavigationEnd, Router} from '@angular/router';
import * as jsPDF from 'jspdf';
import {isNumber} from 'util';
import {isPlatformBrowser} from '@angular/common';
import {Subscription} from 'rxjs/Subscription';

@Component({
  templateUrl: './ownership-result.component.html',
  styles: ['.mat-slider-track-fill{background-color:#20a8d8 !important;}']
})

export class OwnershipResultComponent {
  uid: string;
  date: number;
  captital: number;
  ValveRepairCost: number;
  Valve_Cost: number;
  Actuator_Cost: number;
  Install_Cost: number;
  Shipping_Cost: number;
  Valve_Multi: number;
  ValveRepair_Multi: number;
  Actuator_Multi: number;
  total_static: number;
  total_yearly: number;
  detailhide = true;
  costs = [];
  submitted: FirebaseListObservable<any>;
  constants = {
    valveNumber: 0,
    MTBF: 0,
    failPercent: 0,
    opportunityCost: 0
  };
  constructor( public authService: AuthService, db: AngularFireDatabase, private router: Router) {
    this.date = Math.floor(Date.now() / 10000000);
    console.log(Date.now() / 10000000);
    this.authService.user.subscribe(

      (auth) => {
        if (auth === null) {
         // console.log('Not Logged in.');
          this.router.navigate(['signin']);
        } else {
          this.uid = auth.uid;
          this.submitted = db.list('/ownership/answers/' + this.uid + '/' + this.date + '/submitted');
          db.object('/ownership/answers/' + this.uid + '/' + this.date + '/constants').subscribe(constants => {
            this.constants.valveNumber = constants.valveNumber;

            this.constants.MTBF = constants.MTBF;
            this.constants.failPercent = constants.failPercent;
            this.constants.opportunityCost = constants.opportunityCost;
          });
          this.makeArray();
        }
      }
    );
    window.scrollTo(0, 0);
    console.log("This is the valve cost: " + this.Valve_Cost);
  }

  makeArray() {
    this.submitted.subscribe(items => {
      items.forEach(item => {
        this.costs.push({type: item.type, amount: item.amount, otc: item.otc, quantity: this.constants.valveNumber, desc: item.desc});
      });
      this.getInfo();
      console.log(this.costs);
    })

  }
  getInfo() {
    this.captital = 0;
    this.total_static = 0;
    this.total_yearly = 0;
    this.costs.forEach(item => {
      if (item.otc) {
        this.total_static += (Number(item.amount) * Number(item.quantity));
      } else {
        this.total_yearly += (Number(item.amount) * Number(item.quantity));
      }
      switch (item.type) {

        case 'Cost of a new valve': {
          this.Valve_Cost =  Number(item.amount);
          this.Valve_Multi =  Number(item.quantity);
          this.captital += (this.Valve_Cost * (this.NumberOfNewValve(5, this.Valve_Multi, this.constants.failPercent) + this.Valve_Multi * 1.1));
          break;
        }
        case 'Cost of a new actuator assembly': {
          this.Actuator_Cost =  Number(item.amount);
          this.Actuator_Multi =  Number(item.quantity);
          this.captital += this.Actuator_Cost *  this.Actuator_Multi;
          break;
        }
        case 'Cost to repair the valve (Repair kit and labour)': {
          this.ValveRepairCost =  Number(item.amount);
          console.log('checks');
          console.log("This is the valve repair cost:" + this.ValveRepairCost);
          this.ValveRepair_Multi =  Number(item.quantity);
          this.captital += (this.ValveRepairCost * (this.NumberOfRepair(5, this.ValveRepair_Multi, this.constants.failPercent)));
          break;
        }
        case 'Cost to test a new/repaired valve before it is installed': {
          this.Install_Cost = Number(item.amount);
          this.total_static += (this.Install_Cost * this.Valve_Multi);
          break;
        }
        case 'Cost of packaging and shipping the valve': {
          this.Shipping_Cost = Number(item.amount);
          break;
        }
        case 'Cost to remove and re-install the valve': {
          this.total_static += (Number(item.amount) * Number(item.quantity) * 0.8);
          break;
        }
        default: {
          console.log("In the item switch");
        }
      }
    })
  }
  updateValveNumber() {
    this.costs.forEach(item => {
      item.quantity = this.constants.valveNumber;
    })
    this.getInfo();
  }
  NumberOfNewValve(Year: number, amount: number, percent: number) {
    // console.log(Year, amount, percent);
    const rn = Math.floor( Year * 12  / this.constants.MTBF);
    const repair = amount * rn;
    const valveSpare = repair / percent;
    return Math.round(valveSpare);
  }
  NumberOfRepair(Year: number, amount: number, percent: number) {
    const rn = Math.floor( Year * 12  / this.constants.MTBF);
    const newvalve = this.NumberOfNewValve(Year, amount, percent)
    return Math.round(amount * rn - newvalve);
  }
  OppertunityCost(percent: number) {
    const perc = percent / 100;
    const total = this.captital - this.Valve_Multi * this.Valve_Cost - this.Actuator_Multi * this.Actuator_Cost;
    return (total * perc) * this.constants.MTBF / 12;
  }
  TotalCostofOwnership(Year: number) {
    const valveSpare = (this.NumberOfNewValve(Year, this.Valve_Multi, this.constants.failPercent) + 0.1 * this.Valve_Multi) * this.Valve_Cost;
    const repairSpare = this.NumberOfRepair(Year, this.ValveRepair_Multi, this.constants.failPercent) * this.ValveRepairCost;
    const actuatorSpare = 0.1 * this.Valve_Multi * this.Actuator_Cost;
    const extra = this.ValveRepair_Multi * Math.floor( Year * 12 / this.constants.MTBF) * this.ValveRepairCost;
    const opportunity = this.OppertunityCost(this.constants.opportunityCost);
    const total =  opportunity + valveSpare + repairSpare + actuatorSpare - extra;
    return this.total_static + this.total_yearly * Math.floor( Year * 12 / this.constants.MTBF) + total;

  }
  MonthlyCostofOwnership(Year: number) {
    return this.TotalCostofOwnership(Year) / (Year * 12);
  }
  valveCostChange() {
    this.costs.forEach(item => {
      switch (item.type) {
        case 'cost of a new valve': {
          item.amount = this.Valve_Cost;
          break;
        }
      }
    });
    this.getInfo();
  }
  MonthlyCostPerPosition (Year: number, postions: number) {
    return this.MonthlyCostofOwnership(Year) / postions;
  }
  download() {
    const page = document.getElementById('pdfprint');
    const pdf = new jsPDF('l', 'pt', 'a4');
    pdf.addHTML(page, () => {
      pdf.save('CostOfOwnership.pdf');
    });
  }
  scrollToDetails() {
    this.detailhide = !this.detailhide
    const elemnt = document.getElementById('pdfprint');
    elemnt.scrollIntoView({ behavior: 'smooth' });
  }
}
