import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { StaticWSMediator, SYS_TOKEN_DEF, WebSocketHandler } from '../../../src/assets/js/websocket/WSMediator.js';

import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { EditBasicComponent } from './edit-basic/edit-basic.component';
import { EditWorkComponent } from './edit-work/edit-work.component';
import { EditHobbyComponent } from './edit-hobby/edit-hobby.component';
import { EditSettingComponent } from './edit-setting/edit-setting.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { FriendsSearchComponent } from './friends-search/friends-search.component';
import { FriendsComponent } from './friends/friends.component';
import { FanpageComponent } from './fanpage/fanpage.component';
import { FaqComponent } from './faq/faq.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupsSearchComponent } from './groups-search/groups-search.component';

/*start group home */
import { NewsfeedComponent } from './newsfeed/newsfeed.component';
import { ListNavigationComponent } from './list-navigation/list-navigation.component';
import { RightSidebarListFriendComponent } from './right-sidebar-list-friend/right-sidebar-list-friend.component';
/**end group home */
import { FanpageAdminComponent } from './fanpage-admin/fanpage-admin.component';
import { InboxComponent } from './inbox/inbox.component';
import { ImagesComponent } from './images/images.component';
import { InsightsComponent } from './insights/insights.component';
import { KnowledgeComponent } from './knowledge/knowledge.component';
import { MessagesComponent } from './messages/messages.component';
import { NewpageComponent } from './newpage/newpage.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { PeopleNearbyComponent } from './people-nearby/people-nearby.component';
import { TimelineComponent } from './timeline/timeline.component';
import { TripComponent } from './trip/trip.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { TripPaymentComponent } from './trip-payment/trip-payment.component';
import { VideosComponent } from './videos/videos.component';
import { WidgetsComponent } from './widgets/widgets.component';
import { HeaderComponent } from '../layout/header/header.component';
import { FooterComponent } from '../layout/footer/footer.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemFriendComponent } from './right-sidebar-list-friend/item-friend/item-friend.component';
import { PostComponent } from './post/post.component';
import { PostMetaComponent } from './post/post-meta/post-meta.component';
import { CommentAreaComponent } from './post/comment-area/comment-area.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DialogPostComponent } from './post/dialog-post/dialog-post.component';
import { MatButtonModule } from '@angular/material/button';
import { TripDialogComponent } from './trip/trip-dialog/trip-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { AddFriendDialogComponent } from './trip/addfriend-dialog/addfriend-dialog.component';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { ChatBoxComponent } from './chat-box/chat-box.component';
import { UsersListTripComponent } from './trip/users-list-trip/users-list-trip.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDividerModule} from '@angular/material/divider';
import {MatBadgeModule} from '@angular/material/badge';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatTableModule} from '@angular/material/table';
import { NgxPayPalModule } from 'ngx-paypal';
import {PaymentHistoryDialogComponent} from '../main/trip-payment/payment-history-dialog/payment-history-dialog.component'
//primeng component
import {AccordionModule} from 'primeng/accordion';     //accordion and accordion tab
import {AutoCompleteModule} from 'primeng/autocomplete';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {RatingModule} from 'primeng/rating';
import {ButtonModule} from 'primeng/button';
import {PanelModule} from 'primeng/panel';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToastModule} from 'primeng/toast';
import {RippleModule} from 'primeng/ripple';
import {DialogModule} from 'primeng/dialog';
import {AvatarModule} from 'primeng/avatar';
import {CardModule} from 'primeng/card';
import {DataViewModule} from 'primeng/dataview';
import {TooltipModule} from 'primeng/tooltip';
import {TabMenuModule} from 'primeng/tabmenu';
import {SidebarModule} from 'primeng/sidebar';
//module support
import { ReadMoreModule } from 'ng-readmore';
import { BackgroundAreaComponent } from './background-area/background-area.component';
import { DialogUploadAvatarComponent } from './timeline/dialog-uploadavatar/dialog-uploadavatar.component';
import { DialogUploadBackgroundComponent } from './timeline/dialog-uploadbackground/dialog-uploadbackground.component';
import { DialogReviewComponent} from './fanpage/dialog-review/dialog-review.component';
import { FanpageBackgroundAreaComponent } from './fanpage/fanpage-background-area/fanpage-background-area.component';
import { FanpageReviewComponent } from './fanpage-review/fanpage-review.component';
import { WebSocketService } from '../_core/services/websocket.service';
import { LoginService } from '../_core/services/login.service';
import { delay } from 'rxjs/operators';
export const mainRoutes: Routes = [

  { path: 'home', component: NewsfeedComponent },//main entry point

  /* ------------------------------------------- */
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'edit-basic', component: EditBasicComponent },
  { path: 'edit-hobby', component: EditHobbyComponent },
  { path: 'edit-password', component: EditPasswordComponent },
  { path: 'edit-setting', component: EditSettingComponent },
  { path: 'edit-work', component: EditWorkComponent },
  { path: 'friends', component: FriendsComponent },
  { path: 'friends-search', component: FriendsSearchComponent },
  { path: 'fanpage/:id', component: FanpageComponent },
  { path: 'fanpage-admin', component: FanpageAdminComponent },
  { path: 'fanpage-review', component: FanpageReviewComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'groups-search', component: GroupsSearchComponent },
  { path: 'inbox', component: InboxComponent },
  { path: 'images', component: ImagesComponent },
  { path: 'insights', component: InsightsComponent },
  { path: 'knowledge', component: KnowledgeComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'newpage', component: NewpageComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'people-nearby', component: PeopleNearbyComponent },
  { path: 'trip', component: TripComponent },
  { path: 'trip-detail/:id', component: TripDetailComponent },
  { path: 'trip-payment/:id', component: TripPaymentComponent },
  { path: 'timeline/:id', component: TimelineComponent },
  //{ path: 'timeline', component: TimelineComponent },
  { path: 'videos', component: VideosComponent },
  { path: 'widgets', component: WidgetsComponent },
];

@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    FooterComponent,
    AboutComponent,
    ContactComponent,
    EditBasicComponent,
    EditHobbyComponent,
    EditPasswordComponent,
    EditSettingComponent,
    EditWorkComponent,
    FriendsComponent,
    FriendsSearchComponent,
    FanpageComponent,
    FanpageAdminComponent,
    FaqComponent,
    GroupsComponent,
    GroupsSearchComponent,
    InboxComponent,
    ImagesComponent,
    InsightsComponent,
    KnowledgeComponent,
    MessagesComponent,
    DialogPostComponent,
    /**start group home */
    NewsfeedComponent,

    /*Post */
    PostComponent,
    PostMetaComponent,
    CommentAreaComponent,
    /**left of page */
    ListNavigationComponent,

    /**right of page */
    /**start RightSidebarListFriendComponent*/
    RightSidebarListFriendComponent,
    ItemFriendComponent,//inside list friend
    /**start RightSidebarListFriendComponent*/
    /**end group home */

    NewpageComponent,
    NotificationsComponent,
    PeopleNearbyComponent,
    TimelineComponent,
    TripComponent,
    TripDetailComponent,
    TripDialogComponent,
    TripPaymentComponent,
    VideosComponent,
    WidgetsComponent,
    AddFriendDialogComponent,
    ChatBoxComponent,
    UsersListTripComponent,
    PaymentHistoryDialogComponent,
    BackgroundAreaComponent,
    DialogUploadAvatarComponent,
    DialogUploadBackgroundComponent,
    FanpageBackgroundAreaComponent,
    FanpageReviewComponent,
    DialogReviewComponent
    //Primeng
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatListModule,
    MatMenuModule,
    MatIconModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatCardModule,
    MatStepperModule,
    MatDividerModule,
    NgxPayPalModule,
    MatBadgeModule,
    MatGridListModule,
    MatTableModule,
    //Primeng
    AccordionModule,
    AutoCompleteModule,
    InputTextareaModule,
    RatingModule,
    ButtonModule,
    PanelModule,
    ScrollPanelModule,
    MessagesModule,
    MessageModule,
    ToastModule,
    RippleModule,
    DialogModule,
    CardModule,
    AvatarModule,
    TooltipModule,
    TabMenuModule,
    SidebarModule,
    //Module support
    ReadMoreModule,
    DataViewModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    RouterModule.forChild(mainRoutes),],
    bootstrap:[MainComponent]
})
export class MainModule{
  constructor(private loginService: LoginService) {
    console.log("Main module is constructed")
    StaticWSMediator.register(this.callbackFunc, SYS_TOKEN_DEF.ON_OPENED);
  }

  callbackFunc(message: string): void {
    console.log("sent id");
    //WebSocketHandler.SendMessageToServer(localStorage.getItem("userId"));
    WebSocketHandler.SendMessageToServer("aaaaaaaaaa");
  }
}
