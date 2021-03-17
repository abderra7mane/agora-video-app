import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { NgxAgoraSdkNgModule } from 'ngx-agora-sdk-ng';

import AppRoutes from './app.routes';
import { AppComponent } from './app.component';
import { JoinRoomComponent } from '@app/components';
import { AGORA_APP_ID } from '@app/shared';

@NgModule({
  declarations: [
    AppComponent,
    JoinRoomComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(AppRoutes),
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    NgxAgoraSdkNgModule.forRoot({
      AppID: AGORA_APP_ID,
      Video: {
        codec: 'h264',
        mode: 'rtc',
        role: 'host'
      },
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
