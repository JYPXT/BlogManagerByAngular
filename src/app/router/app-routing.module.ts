import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NofoundComponent } from '../components/nofound/nofound.component';
import { LoginComponent } from '../components/login/login.component';
import { HomeComponent } from '../components/home/home.component';
import { ArticlesComponent } from '../components/articles/articles.component';
import { ArticleHandleComponent } from '../components/article-handle/article-handle.component';
import { CategorysComponent } from '../components/categorys/categorys.component';
import { TagsComponent } from '../components/tags/tags.component';

// 有需要再拆分子路由
const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    // canActivate: [AuthGuardService],
    component: HomeComponent,
    children: [
      { path: 'article', component: ArticlesComponent},
      { path: 'articleHandle', component: ArticleHandleComponent},
      { path: 'category', component: CategorysComponent },
      { path: 'tags', component: TagsComponent }
    ]
  },
  {
    path: 'nofound',
    component: NofoundComponent
  },
  {
    path: '**', // 匹配不到路由时候加载的组件  这东西要放最后
    component: NofoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


  // // 懒加载
  // {
  //   path: 'loadlazy',
  //   loadChildren: './loadlazy.module#LoadLazyModule'
  // },
