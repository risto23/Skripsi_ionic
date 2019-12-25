import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  {
    path: 'encode',
    loadChildren: () => import('./encode/encode.module').then( m => m.EncodePageModule)
  },
  {
    path: 'decode',
    loadChildren: () => import('./decode/decode.module').then( m => m.DecodePageModule)
  },
  {
    path: 'hasil',
    loadChildren: () => import('./hasil/hasil.module').then( m => m.HasilPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
