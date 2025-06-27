import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { TooltipPosition, MatTooltipModule, MatTooltip} from '@angular/material/tooltip';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { UserService } from 'app/core/user/user.service';
//import { User, UserPagination } from '@app/core/user/user.types';
import { DepartmaxModalComponent } from './modal/modal.component';
import { MatTableModule } from '@angular/material/table';
//import { PositionService } from '@app/core/position/position.service';
// import { Position, PositionPagination } from '@app/core/position/position.types';
import { DepartmaxService } from '@app/core/departmax/departmax.service';
import { Departmax, DepartmaxPagination } from '@app/core/departmax/departmax.types';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NgIf, MatTableModule, MatCheckboxModule, MatTooltipModule, MatProgressBarModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, ReactiveFormsModule, MatButtonModule, MatSortModule, NgFor, NgTemplateOutlet, MatPaginatorModule, NgClass, MatSlideToggleModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatRippleModule, AsyncPipe, CurrencyPipe, MatTooltip],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './departmax.component.html',
  styleUrl: './departmax.component.scss'
})
export class DepartmaxComponent implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  departmaxs$: Observable<Departmax[]>;

  showDelete = false;
  isLoading: boolean = false;
  pagination: DepartmaxPagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selection = new SelectionModel<Departmax>(true, []);
  
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _matDialog: MatDialog,
    private _departmaxService: DepartmaxService,
    private _snackBar: MatSnackBar
  )
  {
  }

  /**
   * On init
   */
  ngOnInit(): void
  {

    // Get the pagination
    this._departmaxService.pagination$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((pagination: DepartmaxPagination) =>
    {
        // Update the pagination
        this.pagination = pagination;

        // Mark for check
        this._changeDetectorRef.markForCheck();
    });

    // Get the Users
    this.departmaxs$ = this._departmaxService.departmaxs$;

    // Subscribe to search input field value changes
    this.searchInputControl.valueChanges
    .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) =>
        {
            this.isLoading = true;
            return this._departmaxService.getDepartmax(0, 10, 'name', 'asc', query);
        }),
        map(() =>
        {
            this.selection.clear();
            this.departmaxs$.subscribe(data => { data.forEach(row => this.selection.deselect(row)); });
            this.isLoading = false;
        }),
    )
    .subscribe();

  }

  /**
   * After view init
   */
  ngAfterViewInit(): void
  {
    if ( this._sort && this._paginator )
    {
      // Set the initial sort
      this._sort.sort({
        id          : 'fullname',
        start       : 'asc',
        disableClear: true,
      });

      // Mark for check
      this._changeDetectorRef.markForCheck();

      // If the user changes the sort order...
      this._sort.sortChange
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() =>
        {
            this.selection.clear();
            // Reset back to the first page
            this._paginator.pageIndex = 0;
        });

        // Get data if sort or page changes
        merge(this._sort.sortChange, this._paginator.page).pipe(
          switchMap(() =>
          {
              this.isLoading = true;
              return this._departmaxService.getDepartmax(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
          }),
          map(() =>
          {
              this.selection.clear();
              this.departmaxs$.subscribe(data => { data.forEach(row => this.selection.deselect(row)); });

              this.isLoading = false;
          }),
        ).subscribe();
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

  /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
  trackByFn(index: number, item: any): any {
    return item.userId || index;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() 
  {
    let cc = 0;
    this.departmaxs$.subscribe(data => {
      cc = data.length;
    });

    const numSelected = this.selection.selected.length;
    const numRows = cc;

    return numSelected === numRows;
  }

  /** Selects one row. */
  isOneSelected($event) 
  {
    if($event.checked)
    {
      this.showDelete = true;
    }
    else
    {
      if(this.selection.selected.length == 0) 
      {
        this.showDelete = false;
      }
    } 
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() 
  {
    if(this.isAllSelected()) 
    {
      this.selection.clear();
      this.showDelete = false;
    }
    else
    {
      this.showDelete = true;
      this.departmaxs$.subscribe(data => { data.forEach(row => this.selection.select(row)); });
    }
  }

  /**
   * Create User
   */
  createDepartmax(): void
  {
    const dialogRef = this._matDialog.open(DepartmaxModalComponent, {
      autoFocus: false,
      data     : {
          departmax: {},
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.departmaxs$.subscribe(data => { data.forEach(row => this.selection.deselect(row)); });
      this.showDelete = false;
    });
  }

  /**
   * Edit User
   */
  editDepartmax(data: Departmax): void
  {
    this._matDialog.open(DepartmaxModalComponent, {
      autoFocus: false,
      data     : {
        departmax: data,
      },
    });
  }

  /**
   * Delete User
   */
  deleteDepartmax(data: Departmax): void
  {
    try {
      const confirmation = this._fuseConfirmationService.open({
          title  : 'ลบผู้แผนก',
          message: 'คุณต้องการลบแผนกใช่หรือไม่?',
          actions: {
              confirm: {
                  label: 'ลบ',
              },
              cancel: {
                label: 'ยกเลิก',
            },
          },
          dismissible: false
      });

      // Subscribe to the confirmation dialog closed action
      confirmation.afterClosed().subscribe((result) =>
      {
          if ( result === 'confirmed' )
          {
              // Delete
              this._departmaxService.delete(data.departmaxId).subscribe(() =>
              {
                this.departmaxs$.subscribe(data => {
                  if(data.length == 0)
                  {
                    this.showDelete = false;
                  }
                });

                this.selection.clear();

                this._snackBar.open('ลบข้อมูลเรียบร้อย', 'Close', {
                  horizontalPosition: 'center', 
                  verticalPosition: 'top',
                  duration: 2000, 
                  panelClass: ['snackbar-success'],
                });
              });
          }
      });
    } catch (error) {
      this._snackBar.open('ไม่สามารถลบข้อมูลได้', 'Close', {
        horizontalPosition: 'center', 
        verticalPosition: 'top',
        duration: 2000, 
        panelClass: ['snackBar-error'],
      });
    }
  }

  /**
   * Delete Checking User
   */
  deleteChecDepartmax() : void
  {
   try {
    const confirmation = this._fuseConfirmationService.open({
        title  : 'ลบผู้ใช้งาน',
        message: 'คุณต้องการลบผู้ใช้งานใช่หรือไม่?',
        actions: {
            confirm: {
                label: 'ลบ',
            },
            cancel: {
              label: 'ยกเลิก',
          },
        },
        dismissible: false
    });

    confirmation.afterClosed().subscribe((result) =>
      {
          if ( result === 'confirmed' )
          {
            this.selection.selected.forEach(s => {
              //console.log(s.PositionsName)
              // Delete
              this._departmaxService.delete(s.departmaxId).subscribe(() =>
              {
                if(this.selection.selected.length == 0) 
                {
                  this.showDelete = false;
                  this.selection.clear();
                }
              });
            });

            this.departmaxs$.subscribe(data => {
              if(data.length == 0)
              {
                this.showDelete = false;
                this.selection.clear();
              }
            });

            this._snackBar.open('ลบข้อมูลเรียบร้อย', 'Close', {
              horizontalPosition: 'center', 
              verticalPosition: 'top',
              duration: 2000, 
              panelClass: ['snackbar-success'],
            });
          }
      });
   } catch (error) {
    this._snackBar.open('ไม่สามารถลบข้อมูลได้', 'Close', {
      horizontalPosition: 'center', 
      verticalPosition: 'top',
      duration: 2000, 
      panelClass: ['snackBar-error'],
    });
   }
  }
}
