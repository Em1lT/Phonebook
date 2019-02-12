import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ArraysProvider } from '../../providers/arrays/arrays';

/**
 * Emil Toivainen
 * 10.2.2019
 * Tässä sivussa voidaan muokata käyttääjää sekä lisätä hänelle numeroita.
 */

@IonicPage()
@Component({
  selector: 'page-contact-view',
  templateUrl: 'contact-view.html',
})
export class ContactViewPage {

  contact: any;
  numbers: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController, public arrays: ArraysProvider) {
    this.contact = this.navParams.get('contact');
    console.log(this.contact.firstName);
  }
  //Tapahtuu kun sivua yritetään sulkea. Tarkistaa onko jokin kenttä tyhjä. Puhelinnumero tarkastetaa lisäyksen yhteydessä.
  async ionViewCanLeave() {
    if(this.contact.firstName.length < 1 || this.contact.lastName.length < 1){
      const shouldLeave = await this.confirmLeave();
      return shouldLeave;
    }
    this.contact.firstName = this.arrays.firstToCapital(this.contact.firstName);
    this.contact.lastName = this.arrays.firstToCapital(this.contact.lastName);
    }

  //Kontaktia voidaan muuttaa vaihtamalla uusi kontakti vanhan tillalle Arrayssä. Sitten kun tämä näkymä lähtee pois home.ts tekee uuden listan.
  changeContact(){
    if(this.contact.firstName.length > 0 && this.contact.lastName.length > 0){
      if(this.arrays.contacts.indexOf(this.contact)){
        this.contact.firstName = this.arrays.firstToCapital(this.contact.firstName);
        this.contact.lastName = this.arrays.firstToCapital(this.contact.lastName);
        this.arrays.contacts[this.arrays.contacts.indexOf(this.contact)] = this.contact;
        alert("kontakti vaihdettu!");
      }
    }else{
      alert("Tarkista etu- tai sukunimi");
    }
   
}
//funktio poistaa numeron
deleteNumber(){
  let alert = this.alertCtrl.create({
    title: 'Poista viimeisin numero: '+ this.contact.numbers[this.contact.numbers.length - 1],
    buttons: [
      {
        text: 'peruuta',
        role: 'cancel',
        handler: data => {
          console.log('vaihto peruttu');
        }
      },
      {
        text: 'poista',
        handler: data => {
          this.contact.numbers.pop();
          }
        }
    ]
  });
  alert.present();

}
//Lisää numeron 
  addNumber(){
    let alert = this.alertCtrl.create({
      title: 'Lisää numero',
      inputs: [
        {
          name: 'numbers',
          placeholder: 'puhelin numero',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: 'peruuta',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: 'lisää',
          handler: data => {
            if(this.arrays.phoneVal(data.numbers)){
              this.contact.numbers.push(data.numbers);
            }
            }
          }
      ]
    });
    alert.present();
  
}
//Poistaa koko kontaktin. Antaa kumminkin ensin varoituksen käyttäjälle.
deleteContact(){
  let alert = this.alertCtrl.create({
    title: 'Haluatko poistaa kontaktin?',
    buttons: [
      {
        text: 'peruuta',
        role: 'cancel',
        handler: data => {
          console.log('vaihto peruttu');
        }
      },
      {
        text: 'Kyllä',
        handler: data => {
          let num = this.arrays.contacts.indexOf(this.contact);
          this.arrays.contacts.splice(num,1);
          this.navCtrl.pop();
          }
        }
    ]
  });
  alert.present();
}
//Alert, joka huomauttaa käyttäjää jos jokin kenttä on tyhjä, ennen kuin käyttäjä pystyy lähtemään ruudusta vasemmalta ylhäältä olevasta napista.
confirmLeave(): Promise<Boolean> {
  let resolveLeaving;
  const canLeave = new Promise<Boolean>(resolve => resolveLeaving = resolve);
  const alert = this.alertCtrl.create({
    title:'Tarkista kentät',
    message: 'Yksi kentistä on tyhjä',
    buttons: [
      {
        text: 'Selvä',
        role: 'cancel',
        handler: () => resolveLeaving(false)
      }
    ]
  });
  alert.present();
  return canLeave
}
}