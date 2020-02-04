import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphComponent } from './graph.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: GraphComponent,
  }
]


@NgModule({
  declarations: [GraphComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class GraphModule { }
