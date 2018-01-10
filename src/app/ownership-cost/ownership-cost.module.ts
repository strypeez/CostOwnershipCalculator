/**
 * Created by Eiston on 7/5/2017.
 */
import { NgModule } from '@angular/core';
import {OwnershipRoutingModule} from './ownership-routing.module';
import {OwnershipFormComponent} from './ownership-form.component';
import {OwnershipQuestionComponent} from './ownership-question.component';
import {OwnershipResultComponent} from './ownership-result.component';
import {AuthService} from '../auth/auth.service';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MdSliderModule, MdTooltipModule} from '@angular/material';
import {TabsModule} from 'ngx-bootstrap';
import {OwnershipInformComponent} from './ownership-inform.component';

@NgModule({
  imports: [
    MdTooltipModule,
    MdSliderModule,
    FormsModule,
    CommonModule,
    OwnershipRoutingModule,
    TabsModule,
  ],
  declarations: [
    OwnershipFormComponent,
    OwnershipQuestionComponent,
    OwnershipResultComponent,
    OwnershipInformComponent
  ],
  providers: [AuthService]
})

export class OwnershipCostModule {}
