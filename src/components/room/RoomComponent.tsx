import React from 'react';

import './Room.css';

interface MessageInterface {
    id: string;
    from: string;
    content: string;
}

export default class RoomComponent extends React.Component<any, any> {

    socket: WebSocket;
    localMessageId: number = 0;

    constructor(props : any) {
        super(props);

        let messages : MessageInterface[]= [
            {from: 'Bob', content: 'Hello', id: '1'}
        ];

        this.state = {
            members: [{name: 'Alice'}, {name: 'Bob'}], //TODO load members
            messages: messages,
            input: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        let websocketUrl: string = String(process.env.REACT_APP_WS_URL) || '';
        this.socket = new WebSocket(websocketUrl);
        this.socket.onmessage = this.hanldeWebsocketMessage.bind(this);
    }

    hanldeWebsocketMessage(e: MessageEvent){
        console.log(e.data);
        let messageFromWebsocker: MessageInterface = JSON.parse(e.data);
        this.setState({messages: [...this.state.messages, messageFromWebsocker]});
        console.log(this.state.messages);
        console.log(JSON.stringify(e.data));
    }

    handleSubmit(e: any){
        e.preventDefault();
        let message = this.state.input;
        this.setState({'input': ''});

        this.localMessageId++;
        let newMessage: MessageInterface = {
            id: this.localMessageId.toString(10),
            from: 'Bob',
            content: message
        };
        this.setState({messages: [...this.state.messages, newMessage]});
        this.socket.send(JSON.stringify(newMessage));
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
                        {this.state.members.map((i: any) => <li key={i.name}>{i.name}</li> )}
                    </ul>

                </div>
                <div className="room-mainPanel c-flex secondary-bg primary">
                    <div className="room-region-content">
                        <ul>
                            {this.state.messages.map((i: MessageInterface) => <li>{i.content}</li> )}
                        </ul>
                    </div>

                    <form className="room-region-form" onSubmit={this.handleSubmit} >
                        <input type="text" autoComplete="off" placeholder={"Message #" + this.props.match.params.id} onChange={this.handleChange} value={this.state.input}/>

                        <button id="submitMessage" type="submit">send</button>
                    </form>
                </div>
            </div>
        );
    }
}