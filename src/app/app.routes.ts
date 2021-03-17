import { Routes } from "@angular/router";
import { JoinRoomComponent } from "@app/components";

const AppRoutes: Routes = [
    { path: '', redirectTo: 'join', pathMatch: 'full' },
    { path: 'join', component: JoinRoomComponent },
];

export default AppRoutes;