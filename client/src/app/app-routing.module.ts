import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponentComponent } from './edit-component/edit-component.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ContentComponent } from './content/content.component';
import { HomeComponent } from './home/home.component';
import { DocumentsComponent } from './documents/documents.component';


const routes: Routes = [
  {path:'editor/:docId',component:EditComponentComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'documents',component:DocumentsComponent},
  {path:'document/:id',component:ContentComponent},
  
  {path:'',component:HomeComponent,pathMatch:'full'},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
