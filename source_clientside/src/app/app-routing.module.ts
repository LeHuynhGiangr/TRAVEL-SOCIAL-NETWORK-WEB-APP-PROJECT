import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { config } from 'process';

import { AdministrationRoutingModule } from './administration/administration-routing.module';
import { AdminRouteGuardService } from './administration/service/admin-route-guard.service';
import { AuthenGuard } from './_helpers/authen.guard';
//Global declare routing declaration
const routes: Routes = [
  { path: '', redirectTo: 'main', pathMatch: 'full' },

  //http://domain/main
  { path: 'main', loadChildren: './main/main.module#MainModule', canActivate: [AuthenGuard],
 }, //call ./main/main.module

  { path: '404', loadChildren: './404/404.module#_404Module' }, //call ./login/login.module

  //http://domain/login
  { path: 'login', loadChildren: './login/login.module#LoginModule' }, //call ./login/login.module

  //http://domain/admin
  {
    path: 'admin',
    canActivate: [AdminRouteGuardService],
    runGuardsAndResolvers: 'always',
    loadChildren: () => import('./administration/administration.module').then(m => m.AdministrationModule)
  }, //call ./admin/admin.module

  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
