import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {OnboardinService} from "../../../services/onboardin.service";
import {MultimediaService} from "../../../services/multimedia.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Observable, tap} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.scss']
})
export class CreateTaskDialogComponent {

  receivedData:any;
  selectedStatus:any;
  selectedPlan:any;
  statusTypes:any[] = ["Open", "In Progress", "On Hold", "Pending Review", "Completed", "Canceled", "Reopened"]

  plansStore: any[] = [];
  filteredPlans: any;


  onboardinTaskForm = new FormGroup({
    onboardingPlanId: new FormControl(null, [Validators.required]),
    descriptionTask: new FormControl(null, [Validators.required]),
    startDateTask: new FormControl(null, [Validators.required]),
    endDateTask: new FormControl(null, [Validators.required]),
    statusTask: new FormControl(null, [Validators.required])
  })

  constructor(private multimediaService: MultimediaService,
              private dialog: MatDialog,
              private onboardinService: OnboardinService,
              private snackbar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private ref: MatDialogRef<CreateTaskDialogComponent>) {
  }

  async ngOnInit(): Promise<any> {
    this.receivedData = this.data;

    await this.loadAllPlans().subscribe(()=>{})
    this.patchValues();
  }

  loadAllPlans(): Observable<any> {
    return this.onboardinService.getAllPlans().pipe(
        tap(data => this.plansStore = data)
    );
  }

  filterPlans(): any[]{
    this.filteredPlans = this.plansStore.filter((data:any) => data.organizationId == this.receivedData.data.organizationId? this.filteredPlans = [data]: this.filteredPlans = null)
    this.filteredPlans.sort((a:any, b:any) => {
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    })

    return this.filteredPlans;
  }

  closePopup(){
    this.dialog.closeAll()
  }

  patchValues(){
    if (this.receivedData.data.taskId){
      this.selectedPlan = this.receivedData.data.task.onBoardingPlanId
      this.onboardinTaskForm.get('onboardingPlanId')?.setValue(this.receivedData.data.task.onBoardingPlanId)
      this.onboardinTaskForm.get('descriptionTask')?.setValue(this.receivedData.data.task.description)
      this.onboardinTaskForm.get('startDateTask')?.setValue(this.receivedData.data.task.startdate)
      this.onboardinTaskForm.get('endDateTask')?.setValue(this.receivedData.data.task.taskdate)
      this.onboardinTaskForm.get('statusTask')?.setValue(this.receivedData.data.task.status)
    }
  }

  submitTask(){
    if (this.onboardinTaskForm.valid){
      this.onboardinService.saveOnboardin({
        organizationId: this.receivedData.data.organizationId,
        onBoardingPlanId: this.onboardinTaskForm.value.onboardingPlanId,
        adminEmail: this.receivedData.data.adminEmail,
        description: this.onboardinTaskForm.value.descriptionTask,
        startdate: this.onboardinTaskForm.value.startDateTask,
        taskdate: this.onboardinTaskForm.value.endDateTask,
        status: this.onboardinTaskForm.value.statusTask,
      }).subscribe(data=>{
        this.closePopup()
        this.snackbar.open("Task Created Successfully", "OK", {duration:3000})
      }, error => {
        console.log(error)
      })
    }
  }

  editTask() {
    if (this.receivedData.data.taskId){
      this.onboardinService.editTaskById(this.receivedData.data.taskId, {
        organizationId: this.receivedData.data.organizationId,
        onBoardingPlanId: this.onboardinTaskForm.value.onboardingPlanId,
        adminEmail: this.receivedData.data.userEmail,
        description: this.onboardinTaskForm.value.descriptionTask,
        startdate: this.onboardinTaskForm.value.startDateTask,
        taskdate: this.onboardinTaskForm.value.endDateTask,
        status: this.onboardinTaskForm.value.statusTask
      }).subscribe(data => {
        this.closePopup()
        this.snackbar.open("Task Edited Successfully", "OK", {duration:3000})
      }, error => {
        console.log(error)
      })
    }
  }
}
