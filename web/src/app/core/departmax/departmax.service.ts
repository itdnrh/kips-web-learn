import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Departmax, DepartmaxPagination } from 'app/core/departmax/departmax.types';
import { BehaviorSubject, map, Observable, of, ReplaySubject, switchMap, take, tap, throwError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class DepartmaxService {
    private _httpClient = inject(HttpClient);
    private _departmax: ReplaySubject<Departmax> = new ReplaySubject(null);
    private _departmaxs: ReplaySubject<Departmax[]> = new ReplaySubject<Departmax[]>(null);
    private _pagination: BehaviorSubject<DepartmaxPagination | null> = new BehaviorSubject(null);
    private prefixUrl = 'departmax'

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

   /**
    * Setter for user
    *
    * @param value
    */
   set departmax(value: Departmax)
   {
       // Store the value
       this._departmax.next(value);
   }

   /**
    * Getter for user
    */
   get departmax$(): Observable<Departmax>
   {
       return this._departmax.asObservable();
   }
   
   /**
    * Getter for users
    */
   get departmaxs$(): Observable<Departmax[]>
   {
       return this._departmaxs.asObservable();
   }

   /**
    * Getter for pagination
    */
   get pagination$(): Observable<DepartmaxPagination>
   {
       return this._pagination.asObservable();
   }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getDepartmax(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
     Observable<{ pagination: DepartmaxPagination; data: Departmax[] }>
    {
        return this._httpClient.get<{ pagination: DepartmaxPagination; data: Departmax[] }>(environment.apiURL+this.prefixUrl+'/list?'+'page='+page+'&size='+size+'&sort='+sort+'&order='+order+'&search='+search).pipe(
            tap((response) =>
            {
                this._pagination.next(response.pagination);
                this._departmaxs.next(response.data);
            }),
        );
    }

    /**
     * Post a User
     *
     * @param User
     */
    create(departmax: any): Observable<Departmax>
    {   
        return this.departmaxs$.pipe(
            take(1),
            switchMap(departmaxs => this._httpClient.post<Departmax>(environment.apiURL+this.prefixUrl+'/create', departmax).pipe(
                map((newDepartmax: any) =>
                {
                    // Update the user with the new user
                    this._departmaxs.next([...departmaxs, newDepartmax.data]);

                    // Return the new user from observable
                    return newDepartmax;
                }),
            )),
        );
    }

    /**
     * Get User
     * 
     * @param departmax_id
     */
    getDepartmaxById(departmax_id: number): Observable<any>
    {
        return this._httpClient.get<Departmax>(environment.apiURL+this.prefixUrl+'/details/'+departmax_id).pipe(
            map((departmax) =>
            {
                // Update the user
                this._departmax.next(departmax);

                // Return the user
                return departmax;
            }),
            switchMap((departmax) =>
            {
                if ( !departmax )
                {
                    return throwError('Could not found user with id of ' + departmax_id + '!');
                }

                return of(departmax);
            }),
        );
    }

    /**
     * Update the user
     *
     * @param departmax_id
     * @param departmax
     */
    update(departmax_id: number, departmax: any): Observable<Departmax>
    {
        return this.departmaxs$.pipe(
            take(1),
            switchMap(departmaxs => this._httpClient.put<Departmax>(environment.apiURL+this.prefixUrl+'/update/'+departmax_id, departmax).pipe(
                map((updatedDepartmax: any) =>
                {
                    // Find the index of the updated user
                    const index = departmaxs.findIndex(item => item.departmaxId === departmax_id);

                    // Update the user
                    departmaxs[index] = updatedDepartmax.data;

                    // Update the user
                    this._departmaxs.next(departmaxs);

                    // Return the updated user
                    return updatedDepartmax.data;
                }),
            )),
        );
    }

    /**
     * Delete
     *
     * @param departmax_id
     */
    delete(departmax_id: number): Observable<boolean>
    {
        return this.departmaxs$.pipe(
            take(1),
            switchMap(departmaxs => this._httpClient.delete<boolean>(environment.apiURL+this.prefixUrl+'/delete/'+departmax_id).pipe(
                map((isDeleted: boolean) =>
                {
                    // Find the index of the deleted user
                    const index = departmaxs.findIndex(item => item.departmaxId === departmax_id);

                    // Delete the user
                    departmaxs.splice(index, 1);

                    // Update the user
                    this._departmaxs.next(departmaxs);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }
}
