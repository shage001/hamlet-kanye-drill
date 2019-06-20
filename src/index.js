import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// https://community.ibm.com/community/user/imwuc/blogs/tiago-moura/2018/07/17/5-min-deployment-react-web-app-running-on-ibmcloud

const twitterServiceURL = 'https://us-south.functions.cloud.ibm.com/api/v1/web/samhage%40ibm.com_dev/default/twitter_guesser.json';


class Button extends React.Component {
    render() {
        return (
            <button 
                className="name-button"
                onClick={() => this.props.onClick()}
            >
                {this.props.name}
            </button>
        );
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            curTweet: {text: "loading...", author: "sam"},
        };
    }

    componentWillMount() {
        this.getTweetAndUpdateState();
    }

    getTweet = async () => {
        const response = await fetch(twitterServiceURL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        });
        const body = await response.json();

        if (response.status !== 200) {
            throw Error(body.message);
        }
        return body;
    };

    handleClick() {
        this.getTweetAndUpdateState();
    }

    getTweetAndUpdateState() {
        this.getTweet().then(res => {
            console.log(res);
            this.setState({ curTweet: res });
        });
    }

    render() {
        return (
            <div className="game text-center">
                <div className="header">
                    <h1>Hamelt, Kanye, or Dril?</h1>
                </div>
                <div className="tweet-box">
                    <div className="tweet">{this.state.curTweet.text.toLowerCase()}</div>
                </div>
                <div className="buttons">
                    <Button name="dril" onClick={() => this.handleClick()}/>
                    <Button name="kanye" onClick={() => this.handleClick()}/>
                    <Button name="hamlet" onClick={() => this.handleClick()}/>
                </div>
            </div>
        );
    }
}


ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);
