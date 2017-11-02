import React from 'react';
import './Room.css';
// import {RTCPeerConnection} from '@types/webrtc';

// interface MemberInterface  {
//     name: string;
//     rtcSessionId: string;
// }

// declare var DataChannel: any;


class WebRTCService {

    init(){

    }


    createChannel(label: string){

    }


    joinChannel(label: string){

    }
}


interface MessageInterface {
    from: string;
    content: string;
}

export default class RoomComponent extends React.Component<any, any> {

    constructor(props : any) {
        super(props);

        let messages : MessageInterface[]= [
            {from: 'Bob', content: 'Hello'}
        ];

        this.state = {
            members: [{name: 'Alice'}, {name: 'Bob'}], //TODO load members
            messages: messages
        };

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
                    <div className="room-region-content"></div>
                    <div className="room-region-input">
                        <input type="text" placeholder={"Message #" + this.props.match.params.id}/>
                    </div>
                </div>
            </div>
        );
    }
}