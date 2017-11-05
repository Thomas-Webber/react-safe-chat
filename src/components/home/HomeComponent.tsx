import React from 'react';
import './Home.css';
import Storage from '../../helpers/Storage';

interface _State{
    room: string;
    nickName: string;
    key: string;
    errorMessages: string[];
}

const VALID_CHANNEL_REGEX = /^[A-Za-z]+$/;


export default class HomeComponent extends React.Component<any, _State> {

    public state: _State = {
        room: '',
        nickName: '',
        key: '',
        errorMessages: []
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
        this.setState({errorMessages: []});

        if (!VALID_CHANNEL_REGEX.test(this.state.room)){
            this.setState({errorMessages: [...this.state.errorMessages, "Invalid channel name"]});
            return;
        }

        Storage.setLastRoom(this.state.room);
        Storage.setLastNickName(this.state.nickName);
        Storage.setEncryptinonKey(this.state.key);
        this.props.history.push(`/room/${this.state.room}`);
    }

    private handleChange(e: any){
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        return (
            <div className="c-flex align-item-center primary primary-bg flex-1">
                <h2>Home</h2>
                <form className="home-form scrollbar" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                  <input type="text" name="nickName" placeholder="Nickname" autoFocus value={this.state.nickName} />
                  <br/><br/>
                  <input type="text" name="room" placeholder="#Room" value={this.state.room} />
                  <br/><br/>
                  <input type="password" name="key" autoComplete="off" placeholder="Private key (optional)" value={this.state.key} />
                  <br/><br/><br/>
                  <button type="submit">Enter</button>
                  <ul className="error-message">{this.state.errorMessages.map(i => <li>{i}</li>)}</ul>
                </form>
            </div>
        );
    }
}
