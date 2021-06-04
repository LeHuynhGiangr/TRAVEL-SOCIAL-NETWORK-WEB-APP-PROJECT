import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AppRoutingModule } from '../app-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {DialogDeleteComponent} from './dialog-delete/dialog-delete.component'
import {DialogPostDetailComponent} from './dialog-post-detail/dialog-post-detail.component'
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ButtonModule } from 'primeng/button';
import {AccordionModule} from 'primeng/accordion';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
@NgModule({
  declarations: [AdminComponent,
  DialogDeleteComponent,
  DialogPostDetailComponent],
  imports: [
    CommonModule,
    AppRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    AccordionModule,
    ButtonModule,
    ConfirmDialogModule,
    MessagesModule,
  ]
})
export class AdminModule { }
