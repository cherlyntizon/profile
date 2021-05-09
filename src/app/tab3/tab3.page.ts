import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from "@angular/forms";
import { ContactServiceService } from '../services/contact-service.service';
import {MessagePageModule} from '../pages/message/message.module';
import { Contact } from '../services/contact';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
  contactForm: FormGroup;
  contacts: any = [];

  constructor(private alertCtrl:AlertController,  private contService: ContactServiceService,
    private router: Router,
    public fb: FormBuilder
    ){}

  /*saveContact(){
    let contact = {
    name: this.contName,
    number: this.contNumber
  }
  this.contacts.push(contact);
  this.clearField();
}

  clearField(){
    this.contName ="";
    this.contNumber ="";
  }

  async confirmDelete(cont){
    const alert = await this.alertCtrl.create({
      header: 'Confirm Delete Contacts',
      message: 'Do you want to remove this contact?',
      buttons: [
        {
        text: 'No',
        role: 'cancel',
        cssClass: 'icon-color',
        handler: () => {
          console.log('Cancel Clicked');
        }
        },
        {
          text: 'Yes',
          cssClass:'icon-color',
          handler: () =>{
            let index = this.contacts.indexOf(cont);

            if(index > -1){
              this.contacts.splice(index, 1);
            }
          }
        }
      ]
    });
    await alert.present();
  }
  }*/
  ngOnInit(){

    this.fetchContact();
    let contact = this.contService.getContactList();
    contact.snapshotChanges().subscribe(res => {
      this.contacts = [];
      res.forEach(item => {
        let a = item.payload.toJSON();
        a['$key'] = item.key;
        this.contacts.push(a as Contact);
      }) 
    })
  }

  fetchContact() {
    this.contService.getContactList().valueChanges().subscribe(res => {
      console.log(res)
    })

    this.contactForm = this.fb.group({
      name: [''],
      mobile: ['']
    })
}
  formSubmit() {
    if (!this.contactForm.valid) {
      return false;
    } else {
      this.contService.createContact(this.contactForm.value).then(res => {
        console.log(res)
        this.contactForm.reset();
      })
        .catch(error => console.log(error));
    }
  }
  deleteContact(id) {
    console.log(id)
    if (window.confirm('Are you sure you want to delete this contact?')) {
      this.contService.deleteContact(id)
    }
  }

}
