import { enc, AES, lib } from 'crypto-ts';

export class Crypter{
  /*
  public static encrypt(key: string, value: string): string {
    const parsedKey = enc.Utf8.parse(key);
    const iv = lib.WordArray.random(16); // Gera um IV aleatório de 16 bytes
    const encrypted = AES.encrypt(value, parsedKey, { iv });

    // Combina o IV com o texto criptografado e retorna como uma string
    return iv.toString() + encrypted.toString();
  }

  public static decrypt(key: string, value: string): string {
    const parsedKey = enc.Utf8.parse(key);

    // Extrai o IV do valor criptografado (assume-se que os primeiros 32 caracteres sejam o IV)
    const iv = enc.Hex.parse(value.slice(0, 32));
    const encryptedText = value.slice(32);

    const decrypted = AES.decrypt(encryptedText, parsedKey, { iv });
    return decrypted.toString(enc.Utf8);
  }
    */

  public static encrypt(key: any, value: any){
    key = enc.Utf8.parse(key);
    return AES.encrypt(value, key, {iv: key}).toString();
  }

  public static decrypt(key: any, value: any){
    key = enc.Utf8.parse(key);
    console.log("ParsedKey: ", key);
    const decrypted = AES.decrypt(value, key, { iv: key });
    console.log("Decrypted: ", decrypted.toString(enc.Utf8));
    return decrypted.toString(enc.Utf8);
  }

  /*
  public static decrypt(key: any, value: any){
    key = enc.Utf8.parse(key);
    let decryptedData = AES.decrypt(value, key, {
      iv: key
    });
    return decryptedData.toString( enc.Utf8 );
  }*/
}
