import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AppRoutingModule } from '../app-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {DialogPostDetailComponent} from './dialog-post-detail/dialog-post-detail.component'
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ButtonModule } from 'primeng/button';
import {AccordionModule} from 'primeng/accordion';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';
import { DialogPageRequestComponent } from './dialog-pagerequest/dialog-pagerequest.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {ToastModule} from 'primeng/toast';
@NgModule({
  declarations: [AdminComponent,
  DialogPostDetailComponent,
  DialogPageRequestComponent],
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
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ToastModule
  ],
  exports: [ MatFormFieldModule, MatInputModule ]
})
export class AdminModule { }
