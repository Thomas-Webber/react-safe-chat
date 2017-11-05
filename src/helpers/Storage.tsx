
export default class Storage {

    public static KEY_LAST_ROOM = 'last_room';
    public static KEY_LAST_NICKNAME = 'last_nickname';
    public static KEY_ENCRYPTION_KEY = 'aes256EncriptionKey';

    // NICKNAME
    public static setLastNickName(nickName: string) {
        localStorage.setItem(Storage.KEY_LAST_NICKNAME, nickName);
    }
    public static getLastNickName() {
        return localStorage.getItem(Storage.KEY_LAST_NICKNAME);
    }

    // ROOM
    public static setLastRoom(room: string) {
        localStorage.setItem(Storage.KEY_LAST_ROOM, room);
    }
    public static getLastRoom() {
        return localStorage.getItem(Storage.KEY_LAST_ROOM);
    }

    // KEY
    public static getEncryptionKey() {
        return localStorage.getItem(Storage.KEY_ENCRYPTION_KEY);
    }
    public static setEncryptinonKey(key: string) {
        localStorage.setItem(Storage.KEY_ENCRYPTION_KEY, key);
    }
    public static clearEncryptionKey() {
        localStorage.removeItem(Storage.KEY_ENCRYPTION_KEY);
    }

    public static clearAll() {
        localStorage.clear();
    }
}
