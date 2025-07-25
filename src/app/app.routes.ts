// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { CadastroPetComponent } from './pages/cadastro-pet/cadastro-pet.component';
import { FeedComponent } from './pages/feed/feed.component';
import { PetDetailsComponent } from './pages/pet-details/pet-details.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'feed',
        pathMatch: 'full'
    },
    {
        path: "login",
        component: LoginComponent
    },
    {
        path: "cadastro",
        component: CadastroComponent
    },
    {
        path: "cadastro-pet",
        component: CadastroPetComponent,
        canActivate: [AuthGuard] // Protegendo a rota
    },
    {
        path: "feed",
        component: FeedComponent
    },
    {
        path: "pet/:id",
        component: PetDetailsComponent
    },
    {
        path: "favorites",
        component: FavoritesComponent,
        canActivate: [AuthGuard] // Protegendo a rota
    },
    {
        path: 'profile/:id',
        component: ProfileComponent,
        canActivate: [AuthGuard] // Protegendo a rota
    },
    {
        path: 'meus-pets',
        loadComponent: () => import('./pages/meus-pets/meus-pets.component').then(m => m.MeusPetsComponent),
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: 'feed'
    }
];
