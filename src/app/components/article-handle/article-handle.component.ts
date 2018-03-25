import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpRequestService } from '../../services/http-request.service';
import { UtilService } from '../../services/util.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
@Component({
  selector: 'app-article-handle',
  templateUrl: './article-handle.component.html',
  styleUrls: ['./article-handle.component.css']
})
export class ArticleHandleComponent implements OnInit {

  isEdit = false; // 是否是修改文章
  validateForm: FormGroup;
  validateError: object;
  validateContentControl: FormGroup;
  contentControl = [];
  isloading = false; // 按钮的状态

  tags: Array<any>;
  selectedTag: Array<any>;
  tagsLoading = false;

  categorys: Array<any>;
  selectedCategory: string;
  categorysLoading = false;

  accessRight: number;

  actionUrl: string; // 图片要上传的地址
  pictureUrl: string; // 图片url
  headers: object; // 请求头

  constructor(
    private fb: FormBuilder,
    private http: HttpRequestService,
    private route: ActivatedRoute,
    private util: UtilService) { }

  ngOnInit() {
    this.validateError = {
      title: {required: '请填写标题'},
      content: {required: '请填写内容'}
    };
    this.validateForm = this.fb.group({
      id: [''],
      title: [ '', [ Validators.required ] ],
      // content: [ '', [ Validators.required ] ],
    });
    this.validateContentControl = this.fb.group({});
    this.actionUrl = `${this.http.baseUrl}uploadFile/upload`;
    this.headers = {'Authorization': window.sessionStorage.getItem('token')};
    this.route.queryParams.subscribe(param => {
      if (param.id) {
        this.isEdit = true;
        this.getArticleById(param.id);
      } else {
        this.addContent();
        this.selectedTag = [];
        this.accessRight = 0;
      }
    });
  }

  // 根据id获取文章内容
  getArticleById (id) {
    this.http.post('article/getArticleById', {id}).then((respon) => {
      if (!respon) {return; }
      const { accessRight, category_id, content, picture, tags, title } = respon.data;

      this.validateForm.setValue({
        'id': id,
        'title': title
      });
      this.pictureUrl = picture;
      this.accessRight = accessRight;
      this.openChangeTag(true, tags);
      this.openChangeCategory(true, category_id);
      this.parseContent(JSON.parse(content));
    });
  }

  trackBydatas (index: number, data) {
    return data.id;
  }

  // 修改文章时解析文章，添加验证表单
  parseContent (content) {
    content.forEach(p => {
      const obj = Object.create(null);
      obj['id'] = p['id'];
      obj['name'] = `title${p['id']}`;
      this.validateContentControl.addControl(`title${p['id']}`, new FormControl(p['name'], Validators.required));
      if (p.hasOwnProperty('childer')) {
        obj['childer'] = [];
        p.childer.forEach ((c, i) => {
          const childObject = Object.create(null);
          childObject['childTitleName'] = `title_${p['id']}_${i}`;
          childObject['childContentName'] = `content_${p['id']}_${i}`;
          this.validateContentControl.addControl(`title_${p['id']}_${i}`, new FormControl(c.childTitleName, Validators.required));
          this.validateContentControl.addControl(`content_${p['id']}_${i}`, new FormControl(c.childContentName, Validators.required));
          obj.childer.push(childObject);
        });
      }
      this.contentControl.push(obj);
     });
  }
  // 打开下拉框获取标签
  openChangeTag (isEdit = false, value = '') {
    if (!this.tagsLoading) {
      this.http.post('tag/listAll').then((respon) => {
        if (!respon) {return; }
        this.tags = respon.tag;
        if (isEdit) {
          this.selectedTag = value.split(',').map(o => parseInt(o, 10));
        }
      });
      this.tagsLoading = true;
    }
  }
  // 打开下拉框获取分类
  openChangeCategory (isEdit = false, value = '') {
    if (!this.categorysLoading) {
      this.http.post('category/listAll').then((respon) => {
        if (!respon) {return; }
        this.categorys = respon.category;
        if (isEdit) {
          this.selectedCategory = value;
        }
      });
      this.categorysLoading = true;
    }
  }
  // 上传图片前的回调
  beforeUpload = (file: File) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.util.message.error('Image must smaller than 2MB!');
    }
    return isLt2M;
  }
  // 上传之后的回调
  handleChange ({file}) {
    let loadingId = null;
    if (file.status === 'uploading') {
      loadingId = this.util.message.loading('正在上传图片', {
        nzDuration: 0
      });
    } else if (file.status === 'done') {
      const { response } = file;
      const baseUrl = this.http.baseUrl;
      this.pictureUrl = `${baseUrl.substr(0, baseUrl.length - 1)}${response.imageUrl}`;
      this.util.message.remove(loadingId);
    }
  }
  // 添加验证控制
  addContent (isParent = true, idx = 0) {
    if ( isParent ) {
      const id = this.contentControl.length,
            name = `title${id}`,
            childTitleName = `title_${id}_0`,
            childContentName = `content_${id}_0`;
      this.contentControl.push({
        id,
        name,
        childer: [{
          childTitleName,
          childContentName
        }]
      });
      this.validateContentControl.addControl(name, new FormControl(null, Validators.required));
      this.validateContentControl.addControl(childTitleName, new FormControl(null, Validators.required));
      this.validateContentControl.addControl(childContentName, new FormControl(null, Validators.required));
    } else {
      const cid = this.contentControl[idx]['childer'].length,
            childTitleName = `title_${idx}_${cid}`,
            childContentName = `content_${idx}_${cid}`;
      this.contentControl[idx]['childer'].push({
          childTitleName,
          childContentName
      });
      this.validateContentControl.addControl(childTitleName, new FormControl(null, Validators.required));
      this.validateContentControl.addControl(childContentName, new FormControl(null, Validators.required));
    }
  }
  // 移除文章内容的key
  removeContent (isParent = true, idx, cidx = 0) {
    if (idx === 0 && cidx === 0) {
      this.util.message.info('文章内容不能为空');
      return;
    }
    if ( isParent ) {
      this.removeControl(this.contentControl[idx]);
      this.contentControl.splice(idx, 1);
    } else {
      this.removeControl(this.contentControl[idx]['childer'][cidx]);
      this.contentControl[idx]['childer'].splice(cidx, 1);
    }
  }
  // 移除验证控制
  removeControl (controls: object) {
    if (controls['childer']) {
      const control = controls['childer'];
      control.forEach(o => {
        this.validateContentControl.removeControl(o.childTitleName);
        this.validateContentControl.removeControl(o.childContentName);
      });
      this.validateContentControl.removeControl(controls['name']);
    } else {
      this.validateContentControl.removeControl(controls['childTitleName']);
      this.validateContentControl.removeControl(controls['childContentName']);
    }
  }

  // 检查文章内容字段
  checkFiled () {
    const controls = this.validateContentControl.controls;
    for (const o of Object.keys(controls)) {
      controls[o].markAsDirty();
      if (!controls[o].valid) {
        this.util.message.info('内容字段不能为空');
        return false;
      }
    }
    return true;
  }

  // 将文章内容转成数组
  contentToArray () {
    const controls = this.validateContentControl.value,
          array = [];
    this.contentControl.forEach(o => {
        const obj = Object.create(null);
        obj['id'] = o['id'];
        obj['name'] = controls[o['name']];
        obj['childer'] = [];
        o['childer'].forEach(child => {
          obj['childer'].push({
            childTitleName: controls[child['childTitleName']],
            childContentName: controls[child['childContentName']],
          });
        });
        array.push(obj);
    });
    return array;
  }

  save () {
    const result = this.util.checkValidateForm('info', this.validateForm, this.validateError);
    const checkFiled = this.checkFiled();
    if (!result || !checkFiled) {return; }

    this.isloading = true;
    const articleContentArray = this.contentToArray();
    const params = Object.assign(this.validateForm.value, {
      content: JSON.stringify(articleContentArray),
      picture: this.pictureUrl,
      tags: this.selectedTag.join(','),
      categoryId: this.selectedCategory,
      accessRight: this.accessRight
    });
    let postUrl: string;
    if (this.isEdit) {
      postUrl = 'article/editArticle';
    } else {
      postUrl = 'article/saveArticle';
    }
    this.http.post(postUrl, params).then((respon) => {
      this.isloading = false;
      if (!respon) {return; }
      this.util.toPage(['home/article'], {});
    });
  }
}
