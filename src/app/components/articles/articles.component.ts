import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../services/http-request.service';
import { UtilService } from '../../services/util.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  pageSize = 10;
  pageIndex = 1;
  pageTotal = 1;
  condition = {};
  loading = true;
  searchValue: string;
  data = [];
  tags: Array<string>;

  constructor(
    private http: HttpRequestService,
    private util: UtilService) { }

  ngOnInit() {
    this.getList ({
      pageSize: this.pageSize,
      pageIndex: this.pageIndex,
      condition: this.condition,
    });
  }

  search() {
    let condition = {};
    if (this.searchValue !== '') {
      condition = {'title': {'$like': `%${this.searchValue}%`}};
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
    this.http.post('article/list', options).then((respon) => {
      this.loading = false;
      if (!respon) {return; }
      const { data: {count, rows}, tags} = respon;
      this.pageTotal = count;
      this.data = rows;
      this.tags = tags;
    });
  }

  deleteArticle (idx, {id}) {
    const that = this;
    this.util.confirmServ.confirm({
      title  : '是否确认要删除这个文章',
      // content: '<b>一些解释</b>',
      onOk() {
        that.http.post('article/deleteArticle', {id}).then((respon) => {
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
