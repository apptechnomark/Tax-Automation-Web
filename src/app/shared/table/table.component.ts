
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
  @Input() ActionMapping : boolean = false;
  @Input() TotalCount: number = 0;
  @Input() PageNo: number = 1;
  // @Output() rowClick = new EventEmitter<any>();
  @Output() editClick = new EventEmitter<any>();
  @Output() deleteClick = new EventEmitter<any>();
  @Output() isActiveClick = new EventEmitter<any>();
  @Output() IsEmailConfirmed = new EventEmitter<any>();
  @Output() AddCompany = new EventEmitter<any>();
  
  @Output() nextpage = new EventEmitter<{ pageNo: number, pageSize: number }>();
  @Output() pageSizeChnage = new EventEmitter<{ pageSize: number }>();
  @Output() PriviousPage = new EventEmitter<{ pageNo: number, pageSize: number }>();
  @Output() GotoPage = new EventEmitter<{ pageNo: number, pageSize: number }>();

  pageSizes = [5, 10, 20];
  pageSize: number = this.pageSizes[0];
  ngOnInit() {
    if (this.ActionDelete || this.ActionEdit || this.ActionMapping || this.AddCompany)  {
      this.columns = [...this.columns, actionColumn];
    }
  }


  // onRowClick(row: TableData) {
  //   if (this.columns.every(column => row[column.field] !== 'action')) {
  //     this.rowClick.emit(row);
  //   }
  // }

  onEditClick(row: any) {
    this.editClick.emit(row);
    console.log(row);
  }

  onDeleteClick(row: any) {
    this.deleteClick.emit(row);
  }
  onIsActiveClick(row: TableData) {
    this.isActiveClick.emit(row);
    console.log(row)
  }

  onPageSizeChange() {
    this.pageSizeChnage.emit({ pageSize: this.pageSize });
    console.log(this.pageSize);
  }

  nextPageChanage() {
    this.nextpage.emit({ pageNo: this.PageNo + 1, pageSize: this.pageSize })
  }

  priviousPageChanage() {
    let page = this.PriviousPage.emit({ pageSize: this.pageSize, pageNo: this.PageNo - 1 })
    console.log("priviousPageChange", page)
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.TotalCount / this.pageSize);
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  goToPage(page: number) {
    if (page !== this.PageNo) {
      this.GotoPage.emit({ pageNo: page, pageSize: this.pageSize });
      console.log("goto =>",{ pageNo: page, pageSize: this.pageSize } )
    }
  }

  onResendLinkClick(data: TableData) {
    this.IsEmailConfirmed.emit(data)
  }
    
  onAddCompany(data: TableData) {
    this.AddCompany.emit(data)
  }

}
