import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message } from '../../interfaces/message';
/*
*
*Emil Toivainen
*Säilyttää kolmea eri arrayta.
*contacts array säilyttää kaikki kontaktit kun ne on luettu JSON-tiedostosta.
*headerFirstName ja headerLastName säilyttävät etu- ja sukunimien ensimmäisiä kirjaimia. Niitä käytetään sitten luomaan dynaaminen lista.
*/
@Injectable()
export class ArraysProvider {

  contacts: Array<Message> = [];
  headerFirstName: Array<string>= [];
  headerLastName: Array<string>= [];

  constructor(public http: HttpClient) {
    
  }
/*
*Lisätty viimeiseksi. Tarkistaa käyttäjän syötteen "oikeellisuuden".
*
*/
//Laittaa etukirjaimet isoksi jos käyttäjä ei sitä teee itse
firstToCapital(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}
//Katso onko puhelin numero oikein
phoneVal(num){
  return /^(\s*[0-9]+\s*)+$/.test(num);
}
}
