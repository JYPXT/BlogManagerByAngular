import { Directive, ElementRef, HostListener, Input, Output, EventEmitter} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
@Directive({
  selector: '[appUploadFile]'
})
export class UploadFileDirective {

  @Input() options: object;
  // @Input() multiple: boolean;
  // @Input() maxMultiple: number;
  // @Input() accept: string;

  @Output() change = new EventEmitter();
  inputElem;
  private falg = false;

  constructor(private el: ElementRef, private message: NzMessageService) {
    setTimeout(() => {
      const option = Object.assign({
        accept: 'image/*',
        multiple: false,
        maxMultiple: 0
      }, this.options || {});
      this.addInput(el.nativeElement, option);
    }, 0);

  }

  private addInput (el, option) {
    const that = this;
    let input = el.querySelector('input[type="file"]');
    if (!input) {
      input = document.createElement('input');
      input.style.display = 'none';
      input.type = 'file';
      input.accept = option.accept;
      if ( option.multiple ) {
        input.multiple = 'multiple';
      }
      el.appendChild(input);
      input.addEventListener('change', function(e) {
        if (this.files.length === 0) {return; }
        if (option.multiple && this.files.length > option.maxMultiple ) {
          that.message.info('图片个数超过限制数量');
        }
        // const rexp = new RegExp(option.accept);
        that.multipleFile(this.files, option.maxMultiple).then(result => {
          that.change.emit(result);
        });
      });
      this.inputElem = input;
  }
  }

  private fileReader = (file) => {
    return new Promise((resolve, reject) => {
     const reader = new FileReader();
         reader.readAsDataURL(file);
      reader.onerror = () => {
          reject('读取图片base64 出现错误');
      };
      reader.onload = function() {
          resolve({
            'result': this.result,
            'file': file
          });
      };
    });
  }

  private multipleFile = (files, maxLength = 0) => {
    const arrayFile = [],
        len = maxLength === 0 ? files.length : Math.min(files.length, maxLength);
    for (let i = 0; i < len; i++) {
      arrayFile.push(this.fileReader(files[i]));
    }
    return Promise.all(arrayFile);
  }


  @HostListener('click', ['$event']) onClick(event) {
    event.stopPropagation();
    this.inputElem.click();
  }
}

// 当然，你可以通过标准的 JavaScript 方式手动给宿主 DOM 元素附加一个事件监听器。 但这种方法至少有三个问题：
// 必须正确的书写事件监听器。
// 当指令被销毁的时候，必须拆卸事件监听器，否则会导致内存泄露。
// 必须直接和 DOM API 打交道，应该避免这样做
