import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
  contents = [];

  isloading = false; // 按钮的状态

  tags: Array<any>;
  selectedTag: Array<any>;
  tagsLoading = false;

  categorys: Array<any>;
  selectedCategory: string;
  categorysLoading = false;

  accessRight: number;
  picture: string; // 图片url
  pictureFile: File; // 图片文件

  constructor(
    private fb: FormBuilder,
    private http: HttpRequestService,
    private route: ActivatedRoute,
    private router: Router,
    private util: UtilService) { }

  ngOnInit() {
    this.validateError = {
      title: {required: '请填写标题'},
      content: {required: '请填写内容'}
    };
    this.validateForm = this.fb.group({
      id: [''],
      title: [ '', [ Validators.required ] ],
    });
    this.validateContentControl = this.fb.group({});
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
    this.http.post('/article/getArticleById', {id}).then((respon) => {
      if (!respon) {return; }
      const { accessRight, category_id, content, picture, tags, title } = respon.data;
      this.validateForm.setValue({
        'id': id,
        'title': title
      });
      if (picture !== undefined && picture !== 'undefined' && picture !== null) {
        this.picture = picture;
      }
      this.accessRight = accessRight;
      this.openChangeTag(true, tags);
      this.openChangeCategory(true, category_id);
      this.parseContent(JSON.parse(content));
    });
  }

  trackBydatas (index: number, data) {
    return data.id;
  }
  uploadChange (files) {
    if (files instanceof Array) {
      const { result, file } = files[0];
      this.picture = result;
      this.pictureFile = file;
    }
  }
  // 修改文章时添加验证表单
  parseContent (content) {
    content.forEach(p => {
      const obj = Object.create(null);
      obj['id'] = p['id'];
      obj['title'] = `title${p['id']}`;
      this.validateContentControl.addControl(`title${p['id']}`, new FormControl(p['title'], Validators.required));
      if (p.hasOwnProperty('childern')) {
        obj['childern'] = [];
        p.childern.forEach ((c, i) => {
          const childObject = Object.create(null);
          childObject['title'] = `title_${p['id']}_${i}`;
          childObject['content'] = `content_${p['id']}_${i}`;
          this.validateContentControl.addControl(`title_${p['id']}_${i}`, new FormControl(c.title, Validators.required));
          this.validateContentControl.addControl(`content_${p['id']}_${i}`, new FormControl(c.content, Validators.required));
          obj.childern.push(childObject);
        });
      }
      this.contents.push(obj);
     });
  }
  // 打开下拉框获取标签
  openChangeTag (isEdit = false, value = '') {
    if (!this.tagsLoading) {
      this.http.post('/tag/listAll').then((respon) => {
        if (!respon) {return; }
        this.tags = respon.tag;
        if (isEdit) {
          if (value !== undefined && value !== 'undefined' && value !== null &&  value !== '') {
            this.selectedTag = value.split(',').map(o => parseInt(o, 10));
          } else {
            this.selectedTag = [];
          }
        }
      });
      this.tagsLoading = true;
    }
  }
  // 打开下拉框获取分类
  openChangeCategory (isEdit = false, value = '') {
    if (!this.categorysLoading) {
      this.http.post('/category/listAll').then((respon) => {
        if (!respon) {return; }
        this.categorys = respon.category;
        if (isEdit) {
          this.selectedCategory = value;
        }
      });
      this.categorysLoading = true;
    }
  }
  // 添加文章内容的key
  addContent (isParent = true, idx = 0) {
    if ( isParent ) {
      const id = this.contents.length,
            title = `title${id}`,
            ctitle = `title_${id}_0`,
            content = `content_${id}_0`;
      this.contents.push({
        id, title,
        childern: [{ title: ctitle, content }]
      });
      this.addControl([title, ctitle, content]);
    } else {
      const cid = this.contents[idx]['childern'].length,
            title = `title_${idx}_${cid}`,
            content = `content_${idx}_${cid}`;
      this.contents[idx]['childern'].push({ title, content });
      this.addControl([title, content]);
    }
  }
  // 添加验证控制
  addControl (array) {
    array.forEach (o => {
      this.validateContentControl.addControl(o, new FormControl(null, Validators.required));
    });
  }
  // 移除文章内容的key
  removeContent (isParent = true, idx, cidx = 0) {
    if (idx === 0 && cidx === 0) {
      this.util.message.info('文章内容不能为空'); return;
    }
    if ( isParent ) {
      this.removeControl(this.contents[idx]);
      this.contents.splice(idx, 1);
    } else {
      this.removeControl(this.contents[idx]['childern'][cidx]);
      this.contents[idx]['childern'].splice(cidx, 1);
    }
  }
  // 移除验证控制
  removeControl (controls: object) {
    if (controls['childern']) {
      const control = controls['childern'];
      control.forEach(o => {
        this.validateContentControl.removeControl(o.title);
        this.validateContentControl.removeControl(o.content);
      });
      this.validateContentControl.removeControl(controls['title']);
    } else {
      this.validateContentControl.removeControl(controls['title']);
      this.validateContentControl.removeControl(controls['content']);
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
    this.contents.forEach(o => {
        const obj = Object.create(null);
        obj['id'] = o['id'];
        obj['title'] = controls[o['title']];
        obj['childern'] = [];
        o['childern'].forEach(child => {
          obj['childern'].push({
            title: controls[child['title']],
            content: controls[child['content']],
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
      picture: this.pictureFile,
      tags: this.selectedTag.join(','),
      categoryId: this.selectedCategory,
      accessRight: this.accessRight
    });
    let postUrl: string;
    if (this.isEdit) {
      postUrl = '/article/editArticle';
    } else {
      postUrl = '/article/saveArticle';
    }

    this.http.uploadFile(postUrl, params).then((respon) => {
      this.isloading = false;
      if (!respon) {return; }
      this.util.toPage(['home/article'], {});
    });
  }
}
