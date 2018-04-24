import { Directive,forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[repeatValidate][formControlName],[repeatValidate][formControl],[repeatValidate][ngModel]',
  providers:[
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => RepeatValidatorDirective), multi: true}
  ]
})
export class RepeatValidatorDirective implements Validator{

  constructor( @Attribute('repeatValidate') public repeatValidate: string) { }

  validate(c: AbstractControl) : {[key : string] : any} {


      let thisValue = c;
      let thatValue = c.root.get(this.repeatValidate);


      if(thisValue && thisValue.errors) {
        delete thisValue.errors['repeatValidate'];
      }

      if(thatValue && thatValue.errors){
        delete thatValue.errors['repeatValidate'];
      }


    if(thisValue && thatValue && thisValue.value === thatValue.value){
      //console.log("They have the same value, removing errors");
      delete thatValue.errors['repeatValidate'];
      delete thisValue.errors['repeatValidate'];
      //thatValue.setErrors(null);
      //thisValue.setErrors(null);
      return null;

    } else if(thisValue && thatValue && thisValue.value !== thatValue.value){
      thatValue.setErrors({ repeatValidate: false });
      thisValue.setErrors({ repeatValidate: false });
      
      return {
        repeatValidate: false
      }

    }else if(thisValue && !thatValue){
      thisValue.setErrors({ repeatValidate: false });
      return {
        repeatValidate: false
      }
    }else if(thatValue && !thisValue){
      thatValue.setErrors({ repeatValidate: false });
      return {
        repeatValidate: false
      }
    }

    return null;
  }

}
