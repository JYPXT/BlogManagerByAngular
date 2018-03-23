import { Injectable } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router, ActivatedRoute } from '@angular/router';
@Injectable()
export class UtilService {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public message: NzMessageService,
    public confirmServ: NzModalService) { }
  // 获取当前的表单 dirty 控件没有被修改  valid 有效的
  checkValidateForm (type, validateForm, validateError) {
    const controls = validateForm.controls;
    for (const o of Object.keys(controls)) {
      controls[ o ].markAsDirty();
      if (!controls[o].valid) {
        const errors = controls[o]['errors'];
        for (const i of Object.keys(errors)) {
          this.message[type](validateError[o][i]);
        }
        return false;
      }
    }
    return true;
  }

  toPage(url: Array<string>, option) {
    // {relativeTo: this.route}
    this.router.navigate(url, option);
  }

}
