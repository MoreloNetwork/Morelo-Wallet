import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from "@angular/forms";
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;
  isSubmitted = false;

  constructor(private auth: AuthService, public formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      login: ['', [Validators.required, Validators.minLength(4), this.checkIfExists()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]]
    })
  }

  ngOnInit() {
  }

  private checkIfExists(): ValidatorFn {
    return (control: AbstractControl) => {
      if (control.value.length > 4) {
        let user: User = new User(null, control.value)
        this.auth.checkLogin(user).subscribe( res => {
          if(!res.data.available){
            control.setErrors({'exists': true}) ;
          }
          else return null;
        })
      }
      else return null;
    }
  }

  get errorControl() {
    return this.registerForm.controls;
  }

  get isFormValid() {
    return this.registerForm.valid
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.registerForm.valid) {
      let user: User = this.registerForm.value
      this.auth.register(user).subscribe(res => {
        // parse and display either error or go to the next step
        console.log(res)
        if(res.status == "error"){
          console.log("dupa")
          if(res.data.code == 1){
            console.log("dupa")
          }
        }

      }, err => {
        // server/communication error, parse
        console.log("błont ;<" + err);
      });
    }
  }

}
