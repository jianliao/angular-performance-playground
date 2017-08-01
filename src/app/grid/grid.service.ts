import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk';
import { MdSort } from '@angular/material';
import 'rxjs/add/observable/merge';

import { D3HelperService, GraphNode } from '../d3-helper.service';

@Injectable()
export class GridService {

  dataGridEntries: Observable<UserData[]>;
  gridDataSource = new Subject<GridDataSource>();
  listLength = new Subject<number>();
  private gridDatabase = new GridDatabase();
  private rawDataSource: GridDataSource;

  constructor(private d3Helper: D3HelperService) {
    this.dataGridEntries = this.d3Helper.entitiesAndDetails
      .map(entries => {
        return entries.map(entry => ({ ...entry.entity, relCount: entry.relCount }))
      });

    this.dataGridEntries.subscribe(entries => this.gridDatabase.updateEntities(entries));
  }

  // Accepts the sort control used to sort the data table
  // creates and returns datasource that is suitable for use in material
  // grid
  setupDataSource(sortControl: MdSort) {
    this.rawDataSource = new GridDataSource(this.gridDatabase, sortControl)
    this.gridDataSource.next(this.rawDataSource);
    this.listLength.next(this.gridDatabase.data.length);
  }

  updateFilter(newFilter: string) {
    if (this.rawDataSource) {
      this.rawDataSource.filter = newFilter;
    }
  }
}

export interface UserData extends GraphNode {
  relCount: number
}

/** An example database that the data source uses to retrieve data for the table. */
export class GridDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange = new BehaviorSubject<UserData[]>([]);
  get data(): UserData[] { return this.dataChange.value; }

  constructor() { }

  /** Adds a new user to the database. */
  updateEntities(entities: UserData[]) {
    this.dataChange.next(entities);
  }
}

export class GridDataSource extends DataSource<any> {
  private filterChange = new BehaviorSubject('');
  get filter(): string { return this.filterChange.value; }
  set filter(filter: string) { this.filterChange.next(filter); }

  constructor(private gridDatabase: GridDatabase, private sort: MdSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserData[]> {
    console.log('connecting')
    const displayDataChanges = [
      this.gridDatabase.dataChange.do(() => console.log('fired dbChange')),
      this.filterChange.do(() => console.log('fired filter')),
      this.sort.mdSortChange.do(() => console.log('fired sort'))
    ];

    return Observable.merge(...displayDataChanges)
      .map(() => {
        return this.gridDatabase.data.slice().filter((item: UserData) => {
          const searchStr = item.displayName.toLowerCase();
          return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
        });
      })
      .map(filtered => {
        return this.getSortedData(filtered);
      });
  }

  disconnect() { }

  getSortedData(filtered: UserData[]): UserData[] {
    const data = filtered.slice();
    if (!this.sort.active || this.sort.direction === '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this.sort.active) {
        case 'displayName': [propertyA, propertyB] = [a.displayName, b.displayName]; break;
        case 'x': [propertyA, propertyB] = [a.x, b.x]; break;
        case 'y': [propertyA, propertyB] = [a.y, b.y]; break;
        case 'color': [propertyA, propertyB] = [a.color, b.color]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this.sort.direction === 'asc' ? 1 : -1);
    });
  }
}
