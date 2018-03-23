import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTag'
})
export class FilterTagPipe implements PipeTransform {

  transform(value: string, tags: Array<any>): any {
    const val =  `,${value},`,
          colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'],
          result = [];
    // [].includes([]) 应该比较耗性能
    tags.forEach(o => {
      if (val.includes(`,${o.id},`)) {
        // tagName += `${o.tag},`;
        result.push({
          name: o.tag,
          color: colors[Math.floor(Math.random() * 7 )]
        });
      }
    });
    return result;
  }

}
