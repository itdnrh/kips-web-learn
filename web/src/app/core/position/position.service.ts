import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Position, PositionPagination } from 'app/core/position/position.types';
import { BehaviorSubject, map, Observable, of, ReplaySubject, switchMap, take, tap, throwError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class PositionService {
    private _httpClient = inject(HttpClient);
    private _position: ReplaySubject<Position> = new ReplaySubject(null);
    private _positions: ReplaySubject<Position[]> = new ReplaySubject<Position[]>(null);
    private _pagination: BehaviorSubject<PositionPagination | null> = new BehaviorSubject(null);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

   /**
    * Setter for user
    *
    * @param value
    */
   set position(value: Position)
   {
       // Store the value
       this._position.next(value);
   }

   /**
    * Getter for user
    */
   get position$(): Observable<Position>
   {
       return this._position.asObservable();
   }
   
   /**
    * Getter for users
    */
   get positions$(): Observable<Position[]>
   {
       return this._positions.asObservable();
   }

   /**
    * Getter for pagination
    */
   get pagination$(): Observable<PositionPagination>
   {
       return this._pagination.asObservable();
   }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getPosition(page: number = 0, size: number = 10, sort: string = 'name', order: 'asc' | 'desc' | '' = 'asc', search: string = ''):
     Observable<{ pagination: PositionPagination; data: Position[] }>
    {
        return this._httpClient.get<{ pagination: PositionPagination; data: Position[] }>(environment.apiURL+'positions/list?'+'page='+page+'&size='+size+'&sort='+sort+'&order='+order+'&search='+search).pipe(
            tap((response) =>
            {
                this._pagination.next(response.pagination);
                this._positions.next(response.data);
            }),
        );
    }

    /**
     * Post a User
     *
     * @param User
     */
    create(position: any): Observable<Position>
    {
        return this.positions$.pipe(
            take(1),
            switchMap(positions => this._httpClient.post<Position>(environment.apiURL+'positions/create', position).pipe(
                map((newPosition: any) =>
                {
                    // Update the user with the new user
                    this._positions.next([...positions, newPosition.data]);

                    // Return the new user from observable
                    return newPosition;
                }),
            )),
        );
    }

    /**
     * Get User
     * 
     * @param position_id
     */
    getPositionById(position_id: number): Observable<any>
    {
        return this._httpClient.get<Position>(environment.apiURL+'positions/details/'+position_id).pipe(
            map((position) =>
            {
                // Update the user
                this._position.next(position);

                // Return the user
                return position;
            }),
            switchMap((position) =>
            {
                if ( !position )
                {
                    return throwError('Could not found user with id of ' + position_id + '!');
                }

                return of(position);
            }),
        );
    }

    /**
     * Update the user
     *
     * @param position_id
     * @param position
     */
    update(position_id: number, position: any): Observable<Position>
    {
        return this.positions$.pipe(
            take(1),
            switchMap(positions => this._httpClient.put<Position>(environment.apiURL+'positions/update/'+position_id, position).pipe(
                map((updatedPosition: any) =>
                {
                    // Find the index of the updated user
                    const index = positions.findIndex(item => item.positionId === position_id);

                    // Update the user
                    positions[index] = updatedPosition.data;

                    // Update the user
                    this._positions.next(positions);

                    // Return the updated user
                    return updatedPosition.data;
                }),
            )),
        );
    }

    /**
     * Delete
     *
     * @param position_id
     */
    delete(position_id: number): Observable<boolean>
    {
        return this.positions$.pipe(
            take(1),
            switchMap(positions => this._httpClient.delete<boolean>(environment.apiURL+'positions/delete/'+position_id).pipe(
                map((isDeleted: boolean) =>
                {
                    // Find the index of the deleted user
                    const index = positions.findIndex(item => item.positionId === position_id);

                    // Delete the user
                    positions.splice(index, 1);

                    // Update the user
                    this._positions.next(positions);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }
}
