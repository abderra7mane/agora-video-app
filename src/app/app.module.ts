import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';

import AppRoutes from './app.routes';
import { AppComponent } from './app.component';
import { JoinRoomComponent, RoomComponent } from '@app/pages';
import { 
  UserMediaPreviewComponent, 
  RoomControlsComponent, 
  RoomControlToggleComponent,
  CameraPreviewComponent,
  RoomControlButtonComponent
} from '@app/components';

@NgModule({
  declarations: [
    AppComponent,
    JoinRoomComponent,
    RoomComponent,
    UserMediaPreviewComponent,
    RoomControlsComponent,
    RoomControlToggleComponent,
    CameraPreviewComponent,
    RoomControlButtonComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(AppRoutes),
    BrowserAnimationsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
