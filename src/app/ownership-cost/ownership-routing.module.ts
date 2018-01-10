/**
 * Created by Eiston on 7/5/2017.
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OwnershipFormComponent} from './ownership-form.component';
import {OwnershipQuestionComponent} from './ownership-question.component';
import {OwnershipResultComponent} from './ownership-result.component';
import {OwnershipInformComponent} from './ownership-inform.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'ownership-cost'
    },
    children: [
      {
        path: 'ownership-form',
        component: OwnershipFormComponent,
        data: {
          title: 'Ownership-Form'
        }
      },
      {
        path: 'ownership-result',
        component: OwnershipResultComponent,
        data: {
          title: 'Ownership-Result'
        }
      },
      {
        path: 'ownership-question',
        component: OwnershipQuestionComponent,
        data: {
          title: 'Ownership-Question'
        }
      },
      {
        path: 'ownership-inform',
        component: OwnershipInformComponent,
        data: {
          title: 'Ownership-Information'
        }
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnershipRoutingModule {}
