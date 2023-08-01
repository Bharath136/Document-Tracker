import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContentComponent } from './content/content.component';
import{ HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EditComponentComponent } from './edit-component/edit-component.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { RichTextEditorModule } from '@syncfusion/ej2-angular-richtexteditor';
import { RichTextEditorAllModule } from '@syncfusion/ej2-angular-richtexteditor';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { DocumentsComponent } from './documents/documents.component';
import { LoaderComponent } from './loader/loader.component';



@NgModule({
  declarations: [
    AppComponent,
    ContentComponent,
    EditComponentComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    HeaderComponent,
    DocumentsComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    DropDownListModule, 
    RichTextEditorModule,
    RichTextEditorAllModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


