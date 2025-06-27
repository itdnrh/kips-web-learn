import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { PositionComponent } from './position.component';
import { PositionService } from '@app/core/position/position.service';

export default [
    {
        path: '',
        component: PositionComponent,
        resolve  : {
            positions    : () => inject(PositionService).getPosition(),
        },
    },
] as Routes;
