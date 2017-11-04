
export default class Storage{

    public static KEY_LAST_ROOM = "last_room";
    public static KEY_LAST_NICKNAME = "last_nickname";

    // NICKNAME
    public static setLastNickName(nickName: string){ localStorage.setItem(Storage.KEY_LAST_NICKNAME, nickName);}
    public static getLastNickName(){ return localStorage.getItem(Storage.KEY_LAST_NICKNAME);}

    // ROOM
    public static setLastRoom(room: string){ localStorage.setItem(Storage.KEY_LAST_ROOM, room);}
    public static getLastRoom(){ return localStorage.getItem(Storage.KEY_LAST_ROOM);}


    public static clearAll(){
        localStorage.removeItem(Storage.KEY_LAST_NICKNAME);
        localStorage.removeItem(Storage.KEY_LAST_ROOM);
    }
}
