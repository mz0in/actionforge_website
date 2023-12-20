import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GraphViewerComponent } from './components/graph-viewer/graph-viewer.component';
import { Page404Component } from './components/page-404/page-404.componment';

const routes: Routes = [
  { path: '', component: HomeComponent },

  // TODO: (Seb) Match the entire file path, not just filename
  { path: 'github/:owner/:repo/:ref/.github/workflows/graphs/:filename', component: GraphViewerComponent },

  { path: '**', pathMatch: 'full', component: Page404Component },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 64]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
