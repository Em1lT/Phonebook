import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ArraysProvider } from '../../providers/arrays/arrays';
/**
*Emil Toivainen
*10.02.2019
*Tässä näkymässä voit luoda uuden kontaktin. Se toimii samalla tavalla kuin muokkaa kontaktia sivu. Käyttäjä ei voi luoda yhteistietoa, jos kaikkia
*kohtia ei ole täytetty. Numeroa ei ole pakollista laittaa, mutta sen voi lisätä jälkikäteen.
*/

@IonicPage()
@Component({
  selector: 'page-add-contact',
  templateUrl: 'add-contact.html',
})
export class AddContactPage {

  contact ={
    firstName: "",
    lastName:  "",
    numbers: []
  }
 
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController, public arrays: ArraysProvider) {
  }

  //Lisää uusi numero kontaktiin. Tarkistaa myös ettei puhelinnumerokenttä ole tyhjä.
  addNumber(){
    let alert = this.alertCtrl.create({
      title: 'lisää numero',
      inputs: [
        {
          name: 'numbers',
          placeholder: 'puhelinnumero'
        }
      ],
      buttons: [
        {
          text: 'peru',
          role: 'cancel',
          handler: data => {
            console.log('vaihto peruttu');
          }
        },
        {
          text: 'lisää',
          handler: data => {
            //Jos numero läpäisee testin niin se lisätään kontaktiin.
            if(this.arrays.phoneVal(data.numbers)){
              this.contact.numbers.push(data.numbers);
            }else{
            
            }
            }
          }
      ]
    });
    alert.present();
}
//lisää kontakti luetteloon. Kutsuu myös funktiota joka vaihtaa ensimmäiset kirjaimet isoiksi kirjaimiksi.
addContact(){
  if(this.contact.firstName.length > 0 && this.contact.lastName.length > 0){
    //Jos käyttäjä ei ole laittanut isoa alkukirjainta. Ohjelma korjaa sen automaattisesti.
    this.contact.firstName = this.arrays.firstToCapital(this.contact.firstName);
    this.contact.lastName = this.arrays.firstToCapital(this.contact.lastName);
    this.arrays.contacts.push(this.contact);
    this.navCtrl.pop();
  }else{
    alert("Täytä Etu- ja sukunimikenttä");
  }
  
}
}
