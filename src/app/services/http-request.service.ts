import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Jsonp, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { Observable } from 'rxjs';
import 'rxjs/Rx';

@Injectable()
export class HttpRequestService {

  public baseUrl = environment.config.apiUrl;

  constructor(private http: Http, private NzMessage: NzMessageService, private router: Router) { }

  private getHeaders (option = {}) {
    const token = window.sessionStorage.getItem('token');
    const headers = new Headers();
    for (const i of Object.keys(option)) {
      headers.set(i, option[i]);
    }
    if (token) {
      headers.set('Authorization', token);
    }
    return headers;
  }

  post (url: string, data = {}, isload = {falg: false, loadMessage: '正在加载中...'}) {
    let loadingId = null;
    if (isload.falg) {
      loadingId = this.NzMessage.loading(isload.loadMessage, {
        nzDuration: 0
      });
    }
    const headers = this.getHeaders();
    return this.http.post(`${this.baseUrl}${url}`, data, {headers})
    .map(res => res.json()) // rxjs的  字符串转json
    .toPromise() // 转成promise
    .then(respon => {
      if (isload.falg) {
        this.NzMessage.remove(); // loadingId
      }
      if (respon.status === 'error') {
        if (respon.code === '99') {
          this.router.navigateByUrl('login');
        }
        return Promise.reject(respon.message);
      } else if (respon.message !== 'ok') {
        this.NzMessage.info(respon.message);
      }
      return respon;
    })
    .catch( error => {
      if (isload.falg) {this.NzMessage.remove(); }
      this.NzMessage.error(error);
    });
  }

  uploadFile (url: string, data = {}, isload = {falg: false, loadMessage: '正在加载中...'}) {
    let loadingId = null;
    if (isload.falg) {
      loadingId = this.NzMessage.loading(isload.loadMessage, {
        nzDuration: 0
      });
    }
    const formData: FormData = new FormData();
    for (const i of Object.keys(data)) {
      formData.append(i, data[i]);
    }
    const headers = this.getHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });
    return this.http.post(`${this.baseUrl}${url}`, formData, {headers})
    .map(res => res.json()) // rxjs的  字符串转json
    .toPromise()
    .then(respon => {
      if (isload.falg) {
        this.NzMessage.remove(); // loadingId
      }
      if (respon.status === 'error') {
        if (respon.code === '99') {
          this.router.navigateByUrl('login');
        }
        return Promise.reject(respon.message);
      } else if (respon.message !== 'ok') {
        this.NzMessage.info(respon.message);
      }
      return respon;
    })
    .catch( error => {
      if (isload.falg) {this.NzMessage.remove(); }
      this.NzMessage.error(error);
    });
  }

}
