import { Component } from '@angular/core';
import { NavController, Content, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http'
import { Message } from '../../interfaces/message';
import { ContactViewPage } from '../contact-view/contact-view';
import { ArraysProvider } from '../../providers/arrays/arrays';
import { AddContactPage } from '../add-contact/add-contact';
 /**
  * 
  * Emil Toivainen
  * 10.02.2019
  * Applikaation sivu, joka tulee ensimmäisenä näkyviin, kun sovellusta avataan.
  * 
  */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  //Määritellään muuttujat, joille Typscriptissä pitää myös oikea muoto
  contacts: Array<Message> = [];
  headerFirstName: Array<string>= [];
  headerLastName: Array<string>= [];
  firstNameList: boolean = false;
  lastNameList: boolean = false;

  constructor(public navCtrl: NavController, public http: HttpClient,
     public arrays: ArraysProvider,private alertCtrl: AlertController) {

  }
  //ionViewDidEnter() suoritetaan aina kun sivu tulee esiin. Päivittää sivun listan ja näyttää uuden listan joko etu- tai sukunimen mukaan.
  ionViewDidEnter(){
    this.updateListing();
    if(this.firstNameList && !this.lastNameList){
      this.createListFirstName();
    }else if(!this.firstNameList && this.lastNameList){
      this.createListLastName();
    }
  }
  //ngOnInit() suoritetaan vain kun sivu ensimmäistä kertaa ladataan. Käytän tätä hyödyksi kun luen nimet JSON-tiedostosta.
  ngOnInit(){
    this.FirstListing();
  }
  //Tämä funktio lukee JSON tiedostosta. Se myös käy jokaisen läpi yksittäin ja laittaa ne kolmeen eri ARRAY:hin.
  //Lopuksi Array järjestellään aakkosjärjestykseen.
  FirstListing(){
    this.clearLists();
    this.http.get<Message[]>('/assets/json/contacts.json').subscribe(
      (data: Message[]) => {
        data.forEach((item:Message)=> {
          this.arrays.contacts.push(item);
          if(this.arrays.headerFirstName.indexOf(item.firstName.charAt(0)) > -1 ){
          }else{
            this.arrays.headerFirstName.push(item.firstName.charAt(0));
          }
          if(this.arrays.headerLastName.indexOf(item.lastName.charAt(0)) > -1 ){
          }else{
            this.arrays.headerLastName.push(item.lastName.charAt(0));
          }
        })
        //Laitetaan listat järjestykseen.
        this.arrays.contacts = this.arrays.contacts.sort();
        this.arrays.headerFirstName = this.arrays.headerFirstName.sort();
        this.arrays.headerLastName = this.arrays.headerLastName.sort();
        this.createListFirstName();
      }
    )
  }
  //Metodia kutsutaan aina kun sivu tulee näkyviin uudestaan. Tyhjentää Array ja luo ne uudestaan jolloin etukirjaimet ovat oikeaoppisesti aakkosjärjestyksessä. 
  updateListing(){
    this.arrays.headerFirstName = [];
    this.arrays.headerLastName = [];
    this.arrays.contacts.forEach(
      (item:Message) => {
        if(this.arrays.headerFirstName.indexOf(item.firstName.charAt(0)) > -1 ){
        }else{
          this.arrays.headerFirstName.push(item.firstName.charAt(0));
        }
        if(this.arrays.headerLastName.indexOf(item.lastName.charAt(0)) > -1 ){
        }else{
          this.arrays.headerLastName.push(item.lastName.charAt(0));
        }
      })
      this.arrays.headerFirstName = this.arrays.headerFirstName.sort();
      this.arrays.headerLastName = this.arrays.headerLastName.sort();
    }
//Aina kun tiettyä kontakti klikataan päästään muokkaus sivulle.
  clicked(name: Message){
    this.navCtrl.push(ContactViewPage, {
      contact: name
    });
  }
//Luodaan dynaaminen lista jossa on oikein otsikot sekä etunimet. Funktio voisi olla lyhyempi ja jaotella eri funktioihin.
  createListFirstName(){
    //Tyhjennetään vanha lista ennen uutta
    this.clearLists();
    this.firstNameList = true;
    this.lastNameList = false;
    const content = document.querySelector('#content');
    //Käydään forEachillä läpi joka kirjain ja sen jälkeen käydään läpi nimet. Samalla alkavat kirjaimet laitetaan listaan.
    this.arrays.headerFirstName.forEach(item => {
      const list = document.createElement('ion-list');
      const header = document.createElement('ion-list-header');
      const h1 = document.createElement('h1');
      h1.innerHTML = item;
      const items = document.createElement('ion-item');
      this.arrays.contacts.forEach(name => {
        if(name.firstName.startsWith(item)){
          const firstName = document.createElement('h1');
          firstName.addEventListener("click", () => {
            this.clicked(name);
          })
          firstName.innerHTML = name.firstName +" " +name.lastName;
          items.appendChild(firstName);
        }
      })
      const break1 = document.createElement("BR");
      const break2 = document.createElement("BR");
      header.appendChild(h1);
      list.appendChild(header);
      list.appendChild(items);
      list.appendChild(break1);
      list.appendChild(break2);
      content.appendChild(list);
    })
  }
//Luodaan dynaaminen lista jossa on oikein otsikot sekä sukunimet.
  createListLastName(){
    //Tyhjennetään vanha lista ennen uutta
    this.clearLists();
    this.firstNameList = false;
    this.lastNameList = true;
    //Käydään forEachillä läpi joka kirjain ja sen jälkeen käydään läpi nimet. Samalla alkavat kirjaimet laitetaan listaan.
    const content = document.querySelector('#content');
    this.arrays.headerLastName.forEach(item => {
      const list = document.createElement('ion-list');
      const header = document.createElement('ion-list-header');
      const h1 = document.createElement('h1');
      h1.innerHTML = item;
      const items = document.createElement('ion-item');
      this.arrays.contacts.forEach(name => {
        if(name.lastName.startsWith(item)){
          const firstName = document.createElement('h1');
          firstName.addEventListener("click", () => {
            this.clicked(name);
          })
          firstName.innerHTML = name.lastName + " " +name.firstName;
          items.appendChild(firstName);
        }
      })
      //Muutama /br, jotta lista näyttäisi siistimmältä
      const break1 = document.createElement("BR");
      const break2 = document.createElement("BR");
      header.appendChild(h1);
      list.appendChild(header);
      list.appendChild(items);
      list.appendChild(break1);
      list.appendChild(break2);
      content.appendChild(list);
    })
  }
  //lista tyhjennetään, kun halutaan vaihtaa näkymää etu- ja sukunimilistan välillä
  clearLists(){
    document.querySelector('#content').innerHTML ="";
  }
  //Näytetään lisää nimi näkymä
  addName(){
    this.navCtrl.push(AddContactPage);
  }
}