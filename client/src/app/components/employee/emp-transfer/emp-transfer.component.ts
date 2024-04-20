import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EmployeesService} from "../../../services/employees.service";
import {TransferRequestService} from "../../../services/transfer-request.service";
import {Observable, tap} from "rxjs";
import {
  RequestTransferDialogComponent
} from "../../../shared/dialogs/request-transfer-dialog/request-transfer-dialog.component";
import {LetterDataDialogComponent} from "../../../shared/dialogs/letter-data-dialog/letter-data-dialog.component";
import {
  ChangeJobDataDialogComponent
} from "../../../shared/dialogs/change-job-data-dialog/change-job-data-dialog.component";

@Component({
  selector: 'app-emp-transfer',
  templateUrl: './emp-transfer.component.html',
  styleUrls: ['./emp-transfer.component.scss']
})
export class EmpTransferComponent {

  userId: any
  employeeDataStore: any
  employee: any = {
    id:''
  }
  transferRequestsStore: any[] = [];
  filteredRequests: any;

  constructor(private route: ActivatedRoute, private dialog: MatDialog, private cookieService: AuthService, private snackBar: MatSnackBar, private employeesService: EmployeesService, private transferService: TransferRequestService) {
  }

  async ngOnInit(): Promise<any> {
    this.loadAllUsers().subscribe(()=>{
      this.getUser();
    })

    this.loadAllTransferRequests().subscribe(()=>{
      this.filterLetters();
    })
  }

  loadAllUsers(): Observable<any>{
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  loadAllTransferRequests(): Observable<any> {
    return this.transferService.getAllTransfer().pipe(
        tap(data => this.transferRequestsStore = data)
    );
  }

  filterLetters(): any[]{
    this.filteredRequests = this.transferRequestsStore.filter((data:any)=> data.approved == "pending");
    this.filteredRequests.sort((a:any, b:any) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    return this.filteredRequests;
  }

  getUser() {
    this.userId = this.cookieService.userID().toString();
    return this.employee = this.employeeDataStore.find((emp: any) => emp.id === this.userId);
  }

  toggleDialog(title: any, msg: any, data: any, component: any) {
    const _popup = this.dialog.open(component, {
      width: '350px',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      data: {
        data: data,
        title: title,
        msg: msg
      }
    });
    _popup.afterClosed().subscribe(item => {
      this.loadAllTransferRequests().subscribe(()=>{
        // this.openSnackBar('Requests reloaded!', 'OK')
      });
    })
  }

  openSnackBar(message: any, action: any){
    this.snackBar.open(message, action, {duration:3000})
  }

  approveRequest(id: any, jobData:any) {
    if (id){
      const data:any = {
        id:id,
        type:'transfer',
        jobData:jobData
      }
      this.toggleDialog('Approve Request', 'Change employee\'s job details before confirm the task', data, ChangeJobDataDialogComponent)
    }
  }

  rejectRequest(id: any) {
    if (id){
      if(confirm('Are you sure to decline the request?')){
        this.transferService.changeStatus(id, {
          approved: "declined",
          jobData: null
        }).subscribe(data => {
          console.log(data)
        }, error => {
          console.log(error)
        })
      }
    }
  }

  popupData(id: any) {
    const data = this.filteredRequests.filter((request:any) => request.id == id);

    this.toggleDialog('','', data, LetterDataDialogComponent)
  }
}
