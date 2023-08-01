import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  regForm: FormGroup;

  constructor(private http: HttpClient, private route: Router) {
    this.regForm = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    })

    const token = localStorage.getItem("jwtToken")
    if (token) {
      console.log(token)
      this.route.navigate(['/']) 
    }
  }

  onSubmit(details = { email: String, password: String }): void {
    this.http.post('http://localhost:5100/login', details).subscribe(
      (response: any) => {
        if (response && response.user._id) {
          localStorage.setItem('userId', response.user._id)
          localStorage.setItem('firstname', response.user.firstname)
          console.log(response.user.firstname)
        }
        if (response && response.jwtToken) {
          this.route.navigate(['/']);
          localStorage.setItem('jwtToken', response.jwtToken);
          window.alert('Login Successfully!');
        }
      },
      (error) => {
        console.error(error);
        window.alert('Login failed! Email or Password is wrong');
      }
    );
  }


}
