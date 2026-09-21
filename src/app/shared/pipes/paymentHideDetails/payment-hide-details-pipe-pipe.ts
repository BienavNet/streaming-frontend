import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paymentHideDetailsPipe',
})
export class PaymentHideDetailsPipePipe implements PipeTransform {
  transform(value: string): string {

    let paymentFragmented = value.split('|');

    let numberMsg = `${paymentFragmented[0].substring(0, 4)}*******${paymentFragmented[0].substring(12, 16)}`
    let cvvMsg = `***`

    return `${numberMsg}|${paymentFragmented[1].padStart(2, '0')}|${paymentFragmented[2].padStart(4, '20')}|${cvvMsg}`;
  }
}
