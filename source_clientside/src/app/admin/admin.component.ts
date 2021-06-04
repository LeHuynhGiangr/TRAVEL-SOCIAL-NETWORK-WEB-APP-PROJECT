import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../_core/services/login.service';
import { Router } from '@angular/router';
import { AppUsers } from './../login/shared/login.model';
import { AdminService } from './../admin/admin.service';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component'
import { DialogPostDetailComponent } from './dialog-post-detail/dialog-post-detail.component'
import { MatDialog } from '@angular/material/dialog';
import { PostService } from 'src/app/_core/services/post.service';
import { Post } from 'src/app/_core/models/Post';
import { MatTableDataSource } from '@angular/material/table';
import { Pages } from '../_core/models/pages.model';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationService, MessageService,ConfirmEventType } from 'primeng/api';
import {Message} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public m_posts:Post[];
  public appUsers: AppUsers;
  public users:any
  public m_returnUrl: string;
  public userList = new Array<AppUsers>();
  displayedColumns: string[] = ['Name','Active','Action'];
  displayedRequestColumns: string[] = ['Name','Active','Action'];
  dataSource: MatTableDataSource<Pages>
  dataSourceRequest: MatTableDataSource<Pages>
  pages:any
  pagesrequest:any
  public pageList = new Array<Pages>();
  public pageListRequest = new Array<Pages>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  constructor(private router: Router,private service: LoginService, private Aservice: AdminService,
   public dialog: MatDialog, private PService:PostService,private confirmationService: ConfirmationService, 
   private messageService: MessageService,private primengConfig: PrimeNGConfig) { }

  async ngOnInit() {

    this.appUsers = new AppUsers();
    var user = await this.service.getUser();
    this.appUsers.FirstName = user["firstName"]
    this.appUsers.LastName = user["lastName"]
    this.router.routeReuseStrategy.shouldReuseRoute = () =>{
      return false;
    }
    this.primengConfig.ripple = true;
    this.dataSource = new MatTableDataSource<Pages>();
    this.dataSourceRequest = new MatTableDataSource<Pages>();
    this.getPageListRequestCreate()
    this.getUserList()
    this.getPostList()
    this.getPageList()
  }
  onLogout() {
    this.service.logout();
    this.router.navigateByUrl('/login');
  }
  public getUserList = async () => {
    this.users = await this.Aservice.getAllUsers();
    for (let i = 0; i < this.users.length; i++) {
      let user = new AppUsers();
      user.Id = this.users[i].id.toString();
      user.FirstName = this.users[i].firstName;
      user.LastName = this.users[i].lastName;
      user.Active = this.users[i].active;
      this.userList.push(user);
    }
  }
  public getPostList = async () => {
    this.PService.getPost().subscribe((jsonData:Post[])=>this.m_posts=jsonData);
  }
  openDialog(id): void {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width: '400px',
      height: '150px',
    });
    dialogRef.componentInstance.idUser = id;
    dialogRef.afterClosed().subscribe(result => {
      this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }
    });
  }
  openDialogPost(id): void {
    const dialogRef = this.dialog.open(DialogPostDetailComponent, {
      width: '400px',
      height: '400px',
    });
    dialogRef.componentInstance.m_post = this.m_posts.find(_=>_.id == id);
    dialogRef.afterClosed().subscribe(result => {
      this.router.routeReuseStrategy.shouldReuseRoute = () =>{
        return false;
      }
    });
  }
  async block(id)
  {
    await this.Aservice.blockUser(id)
    this.userList = new Array<AppUsers>()
    this.getUserList()
  }
  async blockUser(id){
    this.confirmationService.confirm({
      message: 'Do you want to change the user status ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.block(id)
          this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
      },
      reject: (type) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
              break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
              break;
          }
      }
    });
  }
  async accept(id)
  {
    await this.Aservice.acceptPage(id)
    this.pageListRequest = new Array<Pages>();
    this.getPageListRequestCreate()
  }
  async acceptPage(id)
  {
    this.confirmationService.confirm({
      message: 'Do you want to accept page ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.accept(id)
          this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
      },
      reject: (type) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
              break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
              break;
          }
      }
    });
  }
  async getPageList()
  {
    this.pages = await this.Aservice.getAllPages()
    for (let i = 0; i < this.pages.length; i++) {
        let page = new Pages();
        page.Id = this.pages[i].id.toString()
        page.Name = this.pages[i].name
        page.Description = this.pages[i].description
        page.Address = this.pages[i].address
        page.Active = this.pages[i].active
        page.RequestCreate = this.pages[i].requestCreate
        page.PhoneNumber = this.pages[i].phoneNumber
        page.UserId = this.pages[i].userId
        this.pageList.push(page)
    }
    this.dataSource.data = this.pageList
  }
  async getPageListRequestCreate()
  {
    this.pagesrequest = await this.Aservice.getAllPages()
    for (let i = 0; i < this.pagesrequest.length; i++) {
        if(this.pagesrequest[i].requestCreate == false)
        {
          let page = new Pages();
          page.Id = this.pagesrequest[i].id.toString()
          page.Name = this.pagesrequest[i].name
          page.Description = this.pagesrequest[i].description
          page.Address = this.pagesrequest[i].address
          page.Active = this.pagesrequest[i].active
          page.RequestCreate = this.pagesrequest[i].requestCreate
          page.PhoneNumber = this.pagesrequest[i].phoneNumber
          page.UserId = this.pagesrequest[i].userId
          this.pageListRequest.push(page)
        }
        else
          i=i+1
    }
    this.dataSourceRequest.data = this.pageListRequest
  }
}
export interface PeriodicElement {
  Active:boolean
  Name:string
  PhoneNumber:string
  Address:string
  Description:string
  Id:string
}

const ELEMENT_DATA: PeriodicElement[] = [];