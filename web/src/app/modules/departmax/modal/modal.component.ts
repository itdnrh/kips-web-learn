import { TextFieldModule } from '@angular/cdk/text-field';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, NgForm, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Observable, ReplaySubject, Subject, map, of, takeUntil } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormField, MatLabel, MatSelect, MatSelectModule } from '@angular/material/select';
import { Departmax } from '@app/core/departmax/departmax.types';
import { DepartmaxService } from '@app/core/departmax/departmax.service';

@Component({
  selector: 'user-modal',
  standalone: true,
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIf, MatButtonModule, MatSelect, MatFormField, MatLabel, MatSelectModule, MatIconModule, FormsModule, TextFieldModule, NgFor, MatCheckboxModule, NgClass, MatRippleModule, MatMenuModule, MatDialogModule, AsyncPipe],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class DepartmaxModalComponent implements OnInit, OnDestroy 
{
  @ViewChild('f', { static: true }) _formMain: NgForm;
 
  departmax$: Observable<Departmax>;

  title = 'เพิ่มแผนก';
  saveClick = false;
  statusActionEdit = false;

  name: string;
  detail: string;
  status = false;
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
     * Constructor
     */
  constructor(
      private _changeDetectorRef: ChangeDetectorRef,
      @Inject(MAT_DIALOG_DATA) 
      private _data: { departmax: Departmax },
      private _departmaxService: DepartmaxService,
      private _matDialogRef: MatDialogRef<DepartmaxModalComponent>,
      private snackBar: MatSnackBar
  )
  {
  }

  // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
    // console.log(this._data);
    
    if ( this._data.departmax )
    {
      // Edit
      this.title = 'แก้ไขแผนก';
      this.statusActionEdit = true;

      this.name = this._data.departmax.name;
      this.detail = this._data.departmax.detail;
      if (this._data.departmax.status == 'Y') {
        this.status = true;
      }

      // Mark for check
      this._changeDetectorRef.markForCheck();
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void
  {
      // Unsubscribe from all subscriptions
      this._unsubscribeAll.next(null);
      this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  //file to base64
  convertFile(file: File) : Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }


   /**
   * Create / Update => user
   *
   */
   async save() 
   {
     this.saveClick = true;
 
     if (this._formMain.invalid) {
       return;
     }
 
     this.saveClick = false;
 
     try {
       const data = {
        name: this._formMain.value.name,
        detail: this._formMain.value.detail,
        status: (this._formMain.value.status == true) ? 'Y' : 'N'
       };
 
       if ( this._data.departmax.departmaxId)
       {
         // Update
         this._departmaxService.update(this._data.departmax.departmaxId, data).subscribe(() =>
         {
           this.snackBar.open('บันทึกข้อมูลเรียบร้อย', 'Close', {
             horizontalPosition: 'center', 
             verticalPosition: 'top',
             duration: 2000, 
             panelClass: ['snackbar-success'],
           });
 
           // Close the modal
           this.close();
         });
       }
       else
       {
         // Create
         this._departmaxService.create(data).pipe(
         map(() =>
         {
           // Get the user
           this.departmax$ = this._departmaxService.departmax$;
 
           this.snackBar.open('บันทึกข้อมูลเรียบร้อย', 'Close', {
             horizontalPosition: 'center', 
             verticalPosition: 'top',
             duration: 2000, 
             panelClass: ['snackbar-success'],
           });
 
           // Close the modal
           this.close();
         })).subscribe();
       }
     } catch (error) {
       this.snackBar.open('ไม่สามารถบันทึกข้อมูลได้', 'Close', {
         horizontalPosition: 'center', 
         verticalPosition: 'top',
         duration: 2000, 
         panelClass: ['snackbar-error'],
       });
     }
   }
 
   /**
    * close
    */
   close(): void
   {
     // Close the dialog
     this._matDialogRef.close();
   }

}