import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {EmployeesService} from "../../../services/employees.service";
import {Observable, tap} from "rxjs";
import {SafeResourceUrl} from "@angular/platform-browser";
import {MultimediaService} from "../../../services/multimedia.service";
import {ShiftsService} from "../../../services/shifts.service";
import {AttendanceService} from "../../../services/attendance.service";

@Component({
  selector: 'app-emp-dashboard',
  templateUrl: './emp-dashboard.component.html',
  styleUrls: ['./emp-dashboard.component.scss']
})
export class EmpDashboardComponent implements OnInit{

  userId: any
  employeeDataStore: any[] = [];
  shiftDataStore: any[] = [];
  attendanceDataStore: any[] = [];
  employee: any = {
    id:''
  }
  filteredEmployees: any[] = [];
  filteredShifts: any[] = [];
  filteredAttendance: any[] = [];
  targetInput:any;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private router: Router,
              private cookieService: AuthService,
              private snackBar: MatSnackBar,
              private shiftService: ShiftsService,
              private attendanceService: AttendanceService,
              private employeesService: EmployeesService,
              private multimediaService: MultimediaService) {
  }

  async ngOnInit(): Promise<any> {
    await this.loadAllUsers().subscribe(()=>{
      this.getUser();
    })
    await this.loadAllShifts().subscribe(()=>{})
    await this.loadAllAttendances().subscribe(()=>{})
  }

  loadAllUsers(): Observable<any>{
    return this.employeesService.getAllEmployees().pipe(
        tap(data => this.employeeDataStore = data)
    );
  }

  filterEmployees(): any[]{
    if (this.targetInput === undefined){
      this.filteredEmployees = this.employeeDataStore.filter((data: any) => data.organizationId === this.employee.organizationId)
    }
    this.filteredEmployees.sort((a:any, b:any) => {
      return new Date(b.jobData.doj).getTime() - new Date(a.jobData.doj).getTime()
    })

    return this.filteredEmployees;
  }

  handleSearch(data: any): void {
    this.targetInput = data as HTMLInputElement;
    const value = this.targetInput.value
    if (value) {
      this.filteredEmployees = this.employeeDataStore.filter((data: any) =>
          data.organizationId === this.employee.organizationId && data.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.filteredEmployees = this.employeeDataStore.filter((data: any) => data.organizationId === this.employee.organizationId);
    }
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

    })
  }

  openSnackBar(message: any, action: any){
    this.snackBar.open(message, action, {duration:3000})
  }

  deleteEmployee(id: any) {
    if (id){
      if (confirm('Are you sure you want to delete this request?')){
        this.employeesService.deleteEmployeeById(id).subscribe(data =>{
          console.log(data)
          this.loadAllUsers().subscribe(()=>{
            this.filterEmployees()
          })
        }, error => {
          console.log(error)
        })
      }
    }
  }

  editEmployee(id: any) {
    if (id){
      this.router.navigate([`/emp-update/${id}`]);
    }
  }

  navigateToProfile(id: any) {
    this.router.navigate([`/profile/${id}/about/${id}`]);
  }

  convertToSafeUrl(url:any):SafeResourceUrl{
    return this.multimediaService.convertToSafeUrl(url,'image/jpeg')
  }

  loadAllShifts(): Observable<any>{
    return this.shiftService.getAllShifts().pipe(
        tap(data => this.shiftDataStore = data)
    );
  }

  filterShifts(): any[]{
    this.filteredShifts = this.shiftDataStore.filter((data: any) => data.organizationId === this.employee.organizationId)

    return this.filteredShifts;
  }

  loadAllAttendances(): Observable<any>{
    return this.attendanceService.getAllAttendance().pipe(
        tap(data => this.attendanceDataStore = data)
    );
  }

  assignShift(email: any, shift: any) {
    this.filteredAttendance = this.attendanceDataStore.filter((data: any) => data.organizationId === this.employee.organizationId && data.email == email)
    this.filteredAttendance.sort((a:any, b:any) => {
      return new Date(b.recordInTime).getTime() - new Date(a.recordInTime).getTime()
    })

    if (this.filteredAttendance[0]){
      this.attendanceService.assignShift(this.filteredAttendance[0].id, shift).subscribe(data => {
        this.openSnackBar("Shift Assigned", "OK")
      }, error => {
        this.openSnackBar("Somethings Wrong! Try again!", "OK")
      })
    }
    else {
      this.openSnackBar("Employee not attended today", "OK")
    }
  }
}
