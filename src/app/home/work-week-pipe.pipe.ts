import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'workWeekPipe'
})
export class WorkWeekPipePipe implements PipeTransform {

  transform(value: any): unknown {
    return "ww"+moment(new Date(value), "YYYY-MM-DD").week()+"'"+new Date(value).getFullYear();
  }

}
@Pipe({
  name: 'dateTimePipe'
})
export class DateTimeFormatPipe implements PipeTransform {
  transform(value: any): unknown {
    return moment(value).format('lll');
  }

}
