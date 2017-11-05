let AES = require('aes256');

export default class Encryption {

    public static encrypt(key: string, data: string) {
        return AES.encrypt(Encryption._getValidKey(key), data);;
    }

    public static decrypt(key: string, data: string) {
        return AES.decrypt(Encryption._getValidKey(key), data);
    }

    public static  _getValidKey(key: string ){
        let fullKey = (key + process.env.REACT_APP_SALT).slice(0, 32);
        return fullKey;
    }

}
