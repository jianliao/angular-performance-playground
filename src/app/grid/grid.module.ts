import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MdInputModule, MdTableModule, MdListModule, MdSortModule, MdSliderModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk';
import { ReactiveFormsModule } from '@angular/forms';

import { GridPageComponent } from './grid-page/grid-page.component';
import { GridPageDisplayComponent } from './grid-page/grid-page.display.component';
import { GridService } from './grid.service';

const gridRoutes: Routes = [
  { path: '', component: GridPageComponent }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(gridRoutes),
    MdInputModule,
    MdTableModule,
    CdkTableModule,
    ReactiveFormsModule,
    MdListModule,
    MdSliderModule,
    MdSortModule
  ],
  declarations: [
    GridPageComponent,
    GridPageDisplayComponent
  ],
  providers: [
    GridService
  ]
})
export class GridModule { }
