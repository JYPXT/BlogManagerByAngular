import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { HttpRequestService } from '../../services/http-request.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-edit-user-info',
  templateUrl: './edit-user-info.component.html',
  styleUrls: ['./edit-user-info.component.css']
})
export class EditUserInfoComponent implements OnInit {

  validateForm: FormGroup;
  validateError;
  avatar: string;
  avatarFile: File;
  background: string;
  backgroundFile: File;
  constructor(
    private fb: FormBuilder,
    private http: HttpRequestService,
    private router: Router,
    private util: UtilService) { }

  ngOnInit() {
    this.validateError = {
      nick: { required: '昵称不能为空' }
    };
    this.validateForm = this.fb.group({
      nick: [ null, [ Validators.required ] ],
      desc: [ null ],
      // domain: [ null, [ Validators.required ] ],
    });
    this.getUserInfo();
  }

  uploadChange (files, isAvatar) {
    // Object.prototype.toString.call(files)
    if (files instanceof Array) {
      const { result, file } = files[0];
      if (isAvatar) {
        this.avatar = result;
        this.avatarFile = file;
      } else {
        this.background = result;
        this.backgroundFile = file;
      }
    }
  }

  getUserInfo () {
    this.http.post('/user/getUserInfo', { }).then((respon) => {
      if (!respon) {return; }
      const { nick, desc, avatar, background } = respon.data;
      this.validateForm.setValue({
        nick, desc
      });
      if (avatar !== 'undefined' && avatar !== undefined && avatar !== '' && avatar !== null) {
        this.avatar = avatar;
      }
      if (background !== 'undefined' && background !== undefined && background !== '' && background !== null) {
        this.background = background;
      }
    });
  }

  save () {
    const result = this.util.checkValidateForm('info', this.validateForm, this.validateError);
    if (!result) {return; }
    const { nick, desc, domain } = this.validateForm.value;
    this.http.uploadFile('/user/editUserInfo', {
      nick,
      desc,
      domain,
      avatar: this.avatarFile,
      background: this.backgroundFile
    }, {
      falg: true,
      loadMessage: '正在修改信息'
    }).then((respon) => {
      if (!respon) {return; }
    });
  }

}
