import React from 'react';

import './Room.css';
import Storage from '../../helpers/Storage';

interface MessageInterface {
    action: string;
    from: string;
    content: string;
}

interface UserInterface {
    name: string;
}

interface _State{
    members: UserInterface[],
    messages: MessageInterface[],
    input:string,
    nickName:string
}

const BACKEND_USER_NAME = "go-safe-chat-backend";
const ACTION_USER_LIST  = "userList";
const ACTION_NEW_USER   = "newUser";
const ACTION_MESSAGE    = "message";

export default class RoomComponent extends React.Component<any, _State> {

    private socket: WebSocket;

    constructor(props : any) {
        super(props);

        this.state = {
            members: [],
            messages: [],
            input: "",
            nickName: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    public componentDidMount(){
        Storage.setLastRoom(this.props.match.params.id);
        let nickName = Storage.getLastNickName();
        if (!nickName){
            this.props.history.push('/home'); // FIXME: bug when redirected, home component is blank
            return;
        }
        this.setState({nickName: nickName});
        let websocketUrl: string = String(process.env.REACT_APP_WS_URL) || '';
        this.socket = new WebSocket(websocketUrl, this.props.match.params.id);
        this.socket.onmessage = this.hanldeWebsocketMessage.bind(this);
    }

    private hanldeWebsocketMessage(e: MessageEvent){
        let messageFromWebsocket: MessageInterface = JSON.parse(e.data);
        console.log(e.data);

        if (messageFromWebsocket.action === ACTION_USER_LIST){
            let offsetName = 1;
            let userList = JSON.parse(messageFromWebsocket.content);
            while (userList.find((i: UserInterface) => i.name == this.state.nickName)){
                this.setState({nickName: this.state.nickName + offsetName.toString()})
                offsetName++;
            }
            userList.push({name: this.state.nickName})
            this.setState({
                members: userList
            });

            let newUserMessage: MessageInterface = {from: this.state.nickName, content: "", action: ACTION_NEW_USER};
            this.socket.send(JSON.stringify(newUserMessage));
        }

        else if (messageFromWebsocket.action === ACTION_NEW_USER){
            // TODO notify new user action
            console.log(messageFromWebsocket);
        }

        else if (messageFromWebsocket.action === ACTION_MESSAGE) {
            this.setState({
                messages: [...this.state.messages, messageFromWebsocket]
            });

            console.log(this.state.members);
            console.log(messageFromWebsocket.from);
            if (!this.state.members.find(i => i.name === messageFromWebsocket.from))
                console.log("!this.state.members.find(i => i.name === messageFromWebsocket.from))")

            if (!this.state.members.find(i => i.name === messageFromWebsocket.from))
                this.setState({ members: [...this.state.members, {name: messageFromWebsocket.from}] });
        }


    }

    private handleSubmit(e: any){
        e.preventDefault();

        let newMessage: MessageInterface = {
            action: 'message',
            from: this.state.nickName,
            content: this.state.input
        };
        this.setState({
            messages: [...this.state.messages, newMessage],
            input: ''
        });
        this.socket.send(JSON.stringify(newMessage));

        //TODO scroll down
    }

    handleChange(e: any) {
        this.setState({'input': e.target.value});
    }

    render() {

        return (
            <div className="d-flex flex-1">
                <div className="room-leftPanel primary-bg primary">
                    <h2>Room {this.props.match.params.id}</h2>
                    <hr/>
                    <ul>
                        {this.state.members.map((i: any) => (i.name != BACKEND_USER_NAME) ? <li key={i.name}>{i.name}</li> : '' )}
                    </ul>

                </div>
                <div className="room-mainPanel c-flex secondary-bg primary">
                    <div className="room-region-content">
                        <ul>
                            {this.state.messages.map((i: MessageInterface) =>
                              <li className="room-message-item d-flex">
                                <span className="room-message-item-from">{i.from} </span>
                                <span className="room-message-item-content">{i.content}</span>
                                <span className="room-message-item-date"></span>
                              </li> )}
                        </ul>
                    </div>

                    <form className="room-region-form d-flex align-item-center justify-content-center" onSubmit={this.handleSubmit} >
                        <input className="room-region-form-message" type="text" autoComplete="off" placeholder={"Message #" + this.props.match.params.id} onChange={this.handleChange} value={this.state.input}/>
                        <button id="submitMessage" type="submit">send</button>
                    </form>
                </div>
            </div>
        );
    }
}
