import { Routes } from '@angular/router';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignUpFormComponent } from './components/sign-up-form/sign-up-form.component';
import { GameLobbyComponent } from './pages/game-lobby/game-lobby.component';

export const routes: Routes = [
    { path: 'login', component: LoginFormComponent },
    { path: 'signup', component: SignUpFormComponent },
    { path: 'game-lobby', component: GameLobbyComponent },
];
