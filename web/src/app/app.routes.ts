import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { EmptyLayoutComponent } from './layout/layouts/empty/empty.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    {path: '', pathMatch : 'full', redirectTo: 'dashboard-system'},

    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboard-system'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
        ]
    },

   
    // routes for auth
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        children: [
            {path: 'dashboard-system', loadChildren: () => import('app/modules/dashboard/system/system.routes')},
            {path: 'setting/user', loadChildren: () => import('app/modules/user/user.routes')},
            {path: 'setting/position', loadChildren: () => import('app/modules/position/position.routes')},
            {path: 'setting/departmax', loadChildren: ()=> import('app/modules/departmax/departmax.routes')}
        ]
    },


    // 404 & Catch all
    {path: '404-not-found', pathMatch: 'full', loadChildren: () => import('app/modules/error/error-404/error-404.routes')},
    {path: '**', redirectTo: '404-not-found'}
    
];
