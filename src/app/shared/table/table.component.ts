import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';


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
  @Output() editClick = new EventEmitter<TableData>();
  @Output() deleteClick = new EventEmitter<TableData>();

  ngOnInit() {
    if(this.ActionDelete || this.ActionEdit)
    {
      this.columns = [...this.columns, actionColumn];
    }
    
  }

  onRowClick(row: TableData) {
    if (this.columns.every(column => row[column.field] !== 'action')) {
      this.rowClick.emit(row);
    }
  }

  onEditClick(row: TableData) {
    this.editClick.emit(row);
  console.log(row);
  
  }

  onDeleteClick(row: TableData) {
    this.deleteClick.emit(row);
  }
}
