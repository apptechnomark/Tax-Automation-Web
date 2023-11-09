import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';


export interface TableData {
  [key: string]: any;
}

export interface TableColumn {
  header: string;
  field: string;
}

const actionColumn: TableColumn = {
  header: 'Action',
  field: 'action'
};
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
 
  @Input() data: TableData[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() ActionEdit: boolean = false;
  @Input() ActionDelete: boolean = false;
  @Output() rowClick = new EventEmitter<TableData>();
  @Output() editClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();

  ngOnInit() {
    if(this.ActionDelete || this.ActionEdit)
    {
      this.columns = [...this.columns, actionColumn];
    }
    console.log(this.columns)
    
  }

  onRowClick(row: TableData) {
    if (this.columns.every(column => row[column.field] !== 'action')) {
      this.rowClick.emit(row);
    }
  }

  onEditClick(row: any) {
    this.editClick.emit(row);
  console.log(row);
  
  }

  onDeleteClick(row: any) {
    this.deleteClick.emit(row);
  }
}
