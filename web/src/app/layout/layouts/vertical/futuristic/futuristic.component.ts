import { Component, OnDestroy, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '@app/core/auth/auth.service';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import {
    FuseNavigationService,
    FuseVerticalNavigationComponent,
} from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'futuristic-layout',
    templateUrl: './futuristic.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        FuseLoadingBarComponent,
        FuseVerticalNavigationComponent,
        UserComponent,
        MatButtonModule,
        MatIconModule,
        FuseFullscreenComponent,
        SearchComponent,
        ShortcutsComponent,
        MessagesComponent,
        NotificationsComponent,
        RouterOutlet,
        QuickChatComponent,
    ],
})
export class FuturisticLayoutComponent implements OnInit, OnDestroy {
    
    isScreenSmall: boolean;
    navigation: any;
    fullname: string;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {

        this.fullname = this._authService.accessFullname;

        
        this.navigation =  [
            {
                id   : 'dashboard.system',
                title: 'หน้าหลัก',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : 'dashboard-system'
            },
            {
                id      : 'setting',
                title   : 'ตั้งค่าระบบ',
                type    : 'collapsable',
                icon    : 'heroicons_outline:cog-8-tooth',
                children: [
                    {
                        id   : 'setting.user',
                        title: 'ผู้ใช้งาน',
                        type : 'basic',
                        link : '/setting/user',
                        icon    : 'heroicons_outline:cog-8-tooth',
                    },
                    {
                        id   : 'setting.position',
                        title: 'ตำแหน่งงาน',
                        type : 'basic',
                        link : '/setting/position',
                        icon    : 'heroicons_outline:cog-8-tooth',
                    },
                    {
                        id   : 'setting.departmax',
                        title: 'แผนก',
                        type : 'basic',
                        link : '/setting/departmax',
                        icon    : 'heroicons_outline:cog-8-tooth',
                    },
                ]
            }
        ];
    

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
