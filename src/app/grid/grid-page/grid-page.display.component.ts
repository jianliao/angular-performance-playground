import { Component, ChangeDetectionStrategy, Input, Output, ViewChild, EventEmitter, OnInit } from '@angular/core';
import { MdSort, MdSliderChange } from '@angular/material';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { GridDataSource, UserData } from '../grid.service';

@Component({
  selector: 'app-grid-page-display',
  templateUrl: './grid-page.display.component.html',
  styleUrls: ['./grid-page.display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class GridPageDisplayComponent implements OnInit {
  @Input() entities: GridDataSource
  @ViewChild(MdSort) sort: MdSort;
  @Input() count: number;
  @Output() countChanged = new EventEmitter<number>();
  @Output() filterChanged = new EventEmitter<string>();
  @Output() gridReady = new EventEmitter<MdSort>();
  @Input() listLength: number;

  displayedColumns = ['displayName', 'relCount', 'color'];
  filter: FormControl = new FormControl();

  constructor() {
    this.filter.valueChanges
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(value => {
        this.filterChanged.emit(value)
      });
  }

  ngOnInit() {
    this.gridReady.emit(this.sort);
  }

  trackNodesBy(_index: number, node: UserData) {
    return node.displayName;
  }

  updateCount(value: MdSliderChange) {
    this.countChanged.emit(value.value);
  }
}
