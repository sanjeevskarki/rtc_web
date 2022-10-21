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

@Pipe({
  name: 'replaceDevtoolString'
})
export class ReplaceDevtoolString implements PipeTransform {
  transform(value: any): unknown {
    return value.replace(".devtools.intel.com","");
  }

}

@Pipe({
  name: 'replaceIntelString'
})
export class ReplaceIntelString implements PipeTransform {
  transform(value: any): unknown {
    return value.replace(".intel.com","");
  }

}
