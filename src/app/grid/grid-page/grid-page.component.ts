import { Component } from '@angular/core';
import { MdSort } from '@angular/material';

import { D3HelperService } from '../../d3-helper.service';
import { GridService } from '../grid.service';

@Component({
  selector: 'app-grid-page',
  templateUrl: './grid-page.component.html',
  styleUrls: ['./grid-page.component.css'],
  // Currently no OnPush here as binding is changed internally
  // This is an indication that we are beginning to reach levels
  // of complexity worthy of centralized state management
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridPageComponent {
  entities = this.gridService.gridDataSource;
  count = this.d3Helper.countValue;
  listLength = this.gridService.listLength;

  constructor(
    private d3Helper: D3HelperService,
    private gridService: GridService
  ) { }

  countChanged(value: number) {
    this.d3Helper.updateCount(value);
  }

  filterChanged(value: string) {
    this.gridService.updateFilter(value);
  }

  gridReady(value: MdSort) {
    this.gridService.setupDataSource(value);
  }
}
