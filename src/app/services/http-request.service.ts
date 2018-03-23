import { Injectable } from '@angular/core';
import { Http, Jsonp, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import 'rxjs/Rx';

@Injectable()
export class HttpRequestService {

  public baseUrl = 'http://127.0.0.1:7001/';
  constructor(private http: Http, private NzMessage: NzMessageService, private router: Router) { }

  post (url: string, data = {}, isload = {falg: false, loadMessage: '正在加载中...'}) {
    let loadingId = null;
    if (isload.falg) {
      loadingId = this.NzMessage.loading(isload.loadMessage, {
        nzDuration: 0
      });
    }
    const token = window.sessionStorage.getItem('token');
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', token);
    }
    return this.http.post(this.baseUrl + url, data, {headers})
    .map(res => res.json()) // 这是rxjs的  字符串转json
    .toPromise() // 转成promise
    .then(respon => {
      if (isload.falg) {
        this.NzMessage.remove(); // loadingId
      }
      if (respon.status === 'error') {
        this.NzMessage.error(respon.errorMessage);
        if (respon.code === '99') {
          this.router.navigateByUrl('login');
        }
        return null;
      } else if (respon.successMessage !== 'ok'){
        this.NzMessage.info(respon.successMessage);
      }
      return respon;
    })
    .catch( error => {
      if (isload.falg) {this.NzMessage.remove(); }
      this.NzMessage.error(error);
    });
  }

  uploadFile (url: string, data = {}, isload = {falg: false, loadMessage: '正在加载中...'}) {

  }

}
