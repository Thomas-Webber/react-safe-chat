import React from 'react';

import './Home.css';
import Storage from '../../helpers/Storage';

interface _State{
    room: string;
    nickName: string;
}

export default class HomeComponent extends React.Component<any, any> {

    public state: _State = {
        room: "",
        nickName: ""
    };

    constructor(props : any) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    public componentDidMount(){
        this.setState({
            room: Storage.getLastRoom() || "",
            nickName: Storage.getLastNickName() || ""
        });
    }

    private handleSubmit(e: any){
        e.preventDefault();
        Storage.setLastRoom(this.state.room);
        Storage.setLastNickName(this.state.nickName);
        this.props.history.push(`/room/${this.state.room}`);
    }

    private handleChange(e: any){
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        return (
            <div className="c-flex align-item-center primary primary-bg flex-1 justify-content-between">
                <h2>Home</h2>
                <form className="home-form" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                  <input type="text" name="nickName" placeholder="Nickname" value={this.state.nickName} />
                  <input type="text" name="room" placeholder="#Room" value={this.state.room} />
                  <br/>
                  <br/>
                  <button type="submit">Enter</button>
                </form>
                <span></span>
            </div>
        );
    }
}
