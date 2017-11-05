import React from 'react';
import ReactDOM from 'react-dom';

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

interface _State {
    members: UserInterface[];
    messages: MessageInterface[];
    input: string;
    nickName: string;
}

const BACKEND_USER_NAME = 'go-safe-chat-backend';
const ACTION_USER_LIST  = 'userList';
const ACTION_NEW_USER   = 'newUser';
const ACTION_USER_EXIT  = 'userLeft';
const ACTION_MESSAGE    = 'message';


export default class RoomComponent extends React.Component<any, _State> {

    private socket: WebSocket;
    private regionContentElement: any;
    private regionContentDOM: any;

    constructor(props: any) {
        super(props);

        this.state = {
            members: [],
            messages: [],
            input: '',
            nickName: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    public componentDidMount() {
        Storage.setLastRoom(this.props.match.params.id);
        let nickName = Storage.getLastNickName();
        if (!nickName) {
            this.props.history.push('/home');
            return;
        }
        this.setState({nickName: nickName});
        let websocketUrl: string = String(process.env.REACT_APP_WS_URL) || '';
        this.socket = new WebSocket(websocketUrl, this.props.match.params.id);
        this.socket.onmessage = this.hanldeWebsocketMessage.bind(this);
        this.regionContentDOM = ReactDOM.findDOMNode(this.regionContentElement);
    }

    public componentWillUnmount(){
        if (!this.socket)
            return;
        this.socket.close();
    }

    private hanldeWebsocketMessage(e: MessageEvent) {
        let messageFromWebsocket: MessageInterface = JSON.parse(e.data);
        console.log(e.data);

        switch (messageFromWebsocket.action) {
            case ACTION_USER_LIST:
                let offsetName = 1;
                let userList = JSON.parse(messageFromWebsocket.content);
                while (userList.find((i: UserInterface) => i.name === this.state.nickName)) {
                    this.setState({nickName: this.state.nickName + offsetName.toString()});
                    offsetName++;
                }
                userList.push({name: this.state.nickName});
                this.setState({
                    members: userList
                });

                let newUserMessage: MessageInterface = {from: this.state.nickName, content: '', action: ACTION_NEW_USER};
                this.socket.send(JSON.stringify(newUserMessage));
                break;
            case ACTION_NEW_USER:
                this.setState({
                    members: [...this.state.members, {name: messageFromWebsocket.content}]
                });
                break;
            case ACTION_MESSAGE:
                this.setState({
                    messages: [...this.state.messages, messageFromWebsocket]
                });

                if (!this.state.members.find(i => i.name === messageFromWebsocket.from))
                    this.setState({ members: [...this.state.members, {name: messageFromWebsocket.from}] });

                this.scrollMaxDownContentRegion();
                break;
            case ACTION_USER_EXIT:
                let members = this.state.members.filter((i: UserInterface) => i.name != messageFromWebsocket.content)
                this.setState({
                    members: members
                });
                break;
            default:
                return;
        }

    }

    private handleSubmit(e: any) {
        e.preventDefault();
        if (!this.state.input)
            return;
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
        this.scrollMaxDownContentRegion();
    }

    private scrollMaxDownContentRegion() {
        setInterval(() => this.regionContentDOM.scrollTop = this.regionContentDOM.scrollHeight, 100);
    }

    private handleChange(e: any) {
        this.setState({'input': e.target.value});
    }

    render() {
        return (
            <div className="d-flex flex-1">
                <div className="room-leftPanel primary-bg primary scrollbar xs-toggle-hide">
                    <h2 className="centered">{this.state.members.length-1} online</h2>
                    <hr/>
                    <ul>
                        {this.state.members
                            .map((i: any) => (i.name !== BACKEND_USER_NAME) ? <li key={i.name}>{i.name}</li> : '' )}
                    </ul>

                </div>
                <div className="room-mainPanel c-flex secondary-bg primary">
                    <div className="primary primary-bg">
                        <h2 className="centered">Room #{this.props.match.params.id}
                            <span className="xs-toggle-show"> &middot; {this.state.members.length-1} online </span>
                        </h2>
                        <hr style={{marginBottom: 0}}/>
                    </div>
                    <div className="room-region-content scrollbar" ref={(el) => { this.regionContentElement = el; }}>
                        <ul>
                            {this.state.messages.map((i: MessageInterface) =>
                              <li className="room-message-item d-flex">
                                <span className="room-message-item-from">{i.from} </span>
                                <span className="room-message-item-content">{i.content}</span>
                                <span className="room-message-item-date"/>
                              </li> )}
                        </ul>
                    </div>

                    <form className="room-region-form d-flex align-item-center justify-content-center" onSubmit={this.handleSubmit} >
                        <input className="room-region-form-message" type="text" autoComplete="off" placeholder={'Message #' + this.props.match.params.id} onChange={this.handleChange} value={this.state.input}/>
                        <button id="submitMessage" type="submit">send</button>
                    </form>
                </div>
            </div>
        );
    }
}
