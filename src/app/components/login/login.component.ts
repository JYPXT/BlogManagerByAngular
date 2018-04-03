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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;
  validateError;
  constructor(
    private fb: FormBuilder,
    private http: HttpRequestService,
    private router: Router,
    private util: UtilService) { }

  ngOnInit() {
    this.validateError = {
      userName: {
        required: '请填写用户名',
        email: '必须是邮箱'
        // maxlength: '' - -小写
      },
      password: {
        required: '请填写密码'
      }
    };
    this.validateForm = this.fb.group({
      userName: [ null, [
        Validators.required,
        Validators.email ] ],  // eg: [Validators.required,Validators.maxLength(10),Validators.minLength(3)]
      password: [ null, [ Validators.required ] ],
      remember: [ true ],
    }); // .subscribe(data=>{})
  }

  login(): void {
    const result = this.util.checkValidateForm('info', this.validateForm, this.validateError);
    if (!result) {return; }
    const { userName, password, remember} = this.validateForm.value;
    this.http.post('/admin/login', {
      account: userName,
      password
    }, {
      falg: true,
      loadMessage: '正在登陆中'
    }).then((respon) => {
      if (!respon) {return; }
      const {token, data: {nick}} = respon;
      window.sessionStorage.setItem('token', token);
      window.sessionStorage.setItem('nick', nick);
      this.router.navigateByUrl('home/article');
    });
  }
}
