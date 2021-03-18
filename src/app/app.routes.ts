import { Routes } from "@angular/router";
import { JoinRoomComponent, RoomComponent } from "@app/components";

const AppRoutes: Routes = [
    { path: '', redirectTo: 'join', pathMatch: 'full' },
    { path: 'join', component: JoinRoomComponent },
    { path: 'room/:id', component: RoomComponent },
];

export default AppRoutes;