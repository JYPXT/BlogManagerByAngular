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
  selector: 'app-edit-user-password',
  templateUrl: './edit-user-password.component.html',
  styleUrls: ['./edit-user-password.component.css']
})
export class EditUserPasswordComponent implements OnInit {

  validateForm: FormGroup;
  validateError;

  constructor(
    private fb: FormBuilder,
    private http: HttpRequestService,
    private router: Router,
    private util: UtilService) { }

  ngOnInit() {
    this.validateError = {
      oldPassword: { required: '请填写旧密码' },
      newPassword: { required: '请填写新密码' },
      confirmPassword: { required: '请填写确认新密码' },
    };
    this.validateForm = this.fb.group({
      oldPassword: [ null, [ Validators.required ] ],
      newPassword: [ null, [ Validators.required ] ],
      confirmPassword: [ null, [ Validators.required ] ],
    });
  }

  save () {
    const result = this.util.checkValidateForm('info', this.validateForm, this.validateError);
    if (!result) {return; }
    const { oldPassword, newPassword, confirmPassword} = this.validateForm.value;
    if (newPassword !== confirmPassword) {
      this.util.message.info('2次输入的新密码不一样');
      return;
    }
    this.http.post('/user/editPassword', {
      oldPassword, newPassword, confirmPassword
    }, {
      falg: true,
      loadMessage: '正在修改密码'
    }).then((respon) => {
      if (!respon) {return; }
      this.router.navigateByUrl('login');
    });
  }
}
