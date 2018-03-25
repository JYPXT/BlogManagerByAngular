import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../services/http-request.service';
import { UtilService } from '../../services/util.service';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  pageSize = 10;
  pageIndex = 1;
  pageTotal = 1;
  condition = {};
  loading = true;
  searchValue: string;
  data = [];

  validateForm: FormGroup;
  validateError;
  title: string;
  isBuild: boolean; // 是否新建
  editIndex: number; // 修改的下标
  isVisible = false;
  isConfirmLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpRequestService,
    private util: UtilService) { }

  ngOnInit() {
    this.validateError = {
      label: {required: '请填写标签'}
    };
    this.validateForm = this.fb.group({
      id: [''],
      label: [ '', [ Validators.required ] ]
    });
    this.getList ({
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      condition: this.condition,
    });
  }

  trackBydatas (index: number, data) {
    return data.id;
  }

  search() {
    let condition = {};
    if (this.searchValue !== '') {
      condition = {'label': {'$like': `%${this.searchValue}%`}};
    }
    this.getList({
      pageSize: this.pageSize,
      pageIndex: 1,
      condition: condition,
    });
  }

  pageIndexChangeClick (pageIndex) {
    this.getList({
      pageSize: this.pageSize,
      pageIndex: pageIndex,
      condition: this.condition,
    });
  }

  getList (options) {
    this.loading = true;
    this.http.post('tag/list', options).then((respon) => {
      this.loading = false;
      if (!respon) {return; }
      const { data: {count, rows} } = respon;
      this.pageTotal = count;
      this.data = rows;
    });
  }

  showModal = (isBuild = true, idx = null, data = {}) => {
    this.validateForm.reset();
    console.log(this.validateForm);
    if (isBuild) {
      this.title = '新建标签';
      this.isBuild = true;
    } else {
      this.title = '修改标签';
      this.isBuild = false;
      this.editIndex = idx;
      this.validateForm.setValue({
        'id': data['id'],
        'label': data['tag']
      });
    }
    this.isVisible = true;
  }

  saveTag = () => {
    const result = this.util.checkValidateForm('info', this.validateForm, this.validateError);
    if (!result) {return; }
    this.isConfirmLoading = true;
    if (this.isBuild) {
      this.http.post('tag/saveTag', this.validateForm.value).then((respon) => {
        this.isVisible = false;
        this.isConfirmLoading = false;
        if (!respon) {return; }
        this.data.push(respon.data);
        this.pageTotal += 1;
      });
    } else {
      this.http.post('tag/editTag', this.validateForm.value).then((respon) => {
        this.isVisible = false;
        this.isConfirmLoading = false;
        if (!respon) {return; }
        this.data[this.editIndex] = respon.data;
      });
    }
  }

  handleCancel = (e) => {
    this.isVisible = false;
  }

  deleteTag (idx, {id}) {
    const that = this;
    this.util.confirmServ.confirm({
      title  : '是否确认要删除这个标签',
      // content: '<b>一些解释</b>',
      onOk() {
        that.http.post('tag/deleteTag', {id}).then((respon) => {
          if (!respon) {return; }
          that.data.splice(idx, 1);
          that.pageTotal -= 1;
        });
      },
      onCancel() {
      }
    });
  }

}
