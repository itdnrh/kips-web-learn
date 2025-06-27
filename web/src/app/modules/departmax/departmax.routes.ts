import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { DepartmaxComponent } from './departmax.component';
import { DepartmaxService } from '@app/core/departmax/departmax.service';

export default [
    {
        path: '',
        component: DepartmaxComponent,
        resolve  : {
            departmaxs    : () => inject(DepartmaxService).getDepartmax(),
        },
    },
] as Routes;
