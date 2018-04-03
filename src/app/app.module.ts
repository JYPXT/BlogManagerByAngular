import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // new
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms'; // new
import { HttpClientModule } from '@angular/common/http'; // new
import { NgZorroAntdModule, NZ_MESSAGE_CONFIG } from 'ng-zorro-antd'; // new
import { AppComponent } from './app.component';
// 组件页面
import { NofoundComponent } from './components/nofound/nofound.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { ArticleHandleComponent } from './components/article-handle/article-handle.component';
import { CategorysComponent } from './components/categorys/categorys.component';
import { TagsComponent } from './components/tags/tags.component';
import { EditUserInfoComponent } from './components/edit-user-info/edit-user-info.component';
import { EditUserPasswordComponent } from './components/edit-user-password/edit-user-password.component';
// 组件
// 路由
import { AppRoutingModule } from './router/app-routing.module';
// 指令
import { SetContainerHeightDirective } from './directives/set-container-height.directive';
// 请求模块
import { HttpModule, JsonpModule } from '@angular/http';
// 服务
import { HttpRequestService } from './services/http-request.service';
import { UtilService } from './services/util.service';
// 过滤器
import { FilterTagPipe } from './pipes/filter-tag.pipe';
import { UploadFileDirective } from './directives/upload-file.directive';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NofoundComponent,
    HomeComponent,
    TagsComponent,
    CategorysComponent,
    ArticlesComponent,
    ArticleHandleComponent,
    FilterTagPipe,
    ArticleHandleComponent,
    EditUserInfoComponent,
    EditUserPasswordComponent ,
    UploadFileDirective,
    SetContainerHeightDirective,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule, // FormBuilder注入报错，所以用了这个
    FormsModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(), // 方法能够接受一个可选的配置对象，用于引入外部的字体文件，类型为 { extraFontName: string, extraFontUrl: string }
    AppRoutingModule
  ],
  providers: [
    HttpRequestService,
    UtilService,
    { provide: NZ_MESSAGE_CONFIG,
      useValue: { nzDuration: 3000 }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
