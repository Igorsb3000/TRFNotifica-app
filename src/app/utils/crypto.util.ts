import { enc, AES } from 'crypto-ts';

export class Crypter{
  public static encrypt(key: any, value: any){
    key = enc.Utf8.parse(key);
    return AES.encrypt(value, key, {iv: key}).toString();
  }

  public static decrypt(key: any, value: any){
    key = enc.Utf8.parse(key);
    let decryptedData = AES.decrypt(value, key, {
      iv: key
    });
    return decryptedData.toString( enc.Utf8 );
  }
}
