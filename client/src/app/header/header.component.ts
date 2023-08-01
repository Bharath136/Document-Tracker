import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isLoggedIn = false

  constructor(){
    const token = localStorage.getItem('jwtToken')
    if(token){
      this.isLoggedIn = true
    }else{
      this.isLoggedIn = false
    }
  }

  onLogout(){
    localStorage.clear()
    this.isLoggedIn = false
  }

}
