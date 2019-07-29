import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import hamlet from './assets/img/hamlet.jpg';
import kanye from './assets/img/kanye.jpg';
import dril from './assets/img/dril.jpg';

// https://community.ibm.com/community/user/imwuc/blogs/tiago-moura/2018/07/17/5-min-deployment-react-web-app-running-on-ibmcloud

const twitterServiceURL = 'https://us-south.functions.cloud.ibm.com/api/v1/web/shage001%40gmail.com_dev/default/hamletkanyedril.json';
const profileMap = {
    'hamlet': {'image': hamlet, 'username': 'Prince Hamlet', 'handle': '@hamletthedane'},
    'kanye': {'image': kanye, 'username': 'ye', 'handle': '@kanyewest'},
    'dril': {'image': dril, 'username': 'wint', 'handle': '@dril'},
};


class Button extends React.Component {
    render() {
        return (
            <button 
                id={this.props.name}
                className="name-button"
                onMouseOver={(e) => this.props.onMouseOver(e)}
                onClick={(e) => this.props.onClick(e)}
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
            curTweet: {text: 'loading...', author: 'sam'},
            curProfile: ['hamlet', 'kanye', 'dril'][Math.floor(Math.random() * 3)],
            numGuesses: 0,
            numCorrect: 0,
            scoreColor: '#000000',
        };
    }

    componentWillMount() {
        this.getTweetAndUpdateState();
    }

    handleMouseOver(e) {
        this.setState({
            curProfile: e.target.id
        });
    }

    handleClick(e) {
        const guess = e.target.id;
        const actual = this.state.curTweet.author;
        var correct = guess === actual ? true : false;

        var newCorrect = this.state.numCorrect;
        if (correct) {
            newCorrect++;
        }
        const color = determineColor(newCorrect, this.state.numGuesses + 1);
        this.setState({ scoreColor: color });

        this.setState({ numGuesses: this.state.numGuesses + 1 });
        this.setState({ numCorrect: newCorrect });

        this.getTweetAndUpdateState();
    }

    getTweetAndUpdateState() {
        this.getTweet().then(res => {
            console.log(res);
            this.setState({ curTweet: res });
        });
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

    render() {
        return (
            <div className="game text-center">
                <div className="header">
                    <h1>Hamlet, Kanye, or Dril?</h1>
                </div>
                <div className="buttons">
                    <Button name="hamlet" onMouseOver={(e) => this.handleMouseOver(e)} onClick={(e) => this.handleClick(e)}/>
                    <Button name="kanye" onMouseOver={(e) => this.handleMouseOver(e)} onClick={(e) => this.handleClick(e)}/>
                    <Button name="dril" onMouseOver={(e) => this.handleMouseOver(e)} onClick={(e) => this.handleClick(e)}/>
                </div>
                <div className="tweet-box">
                    <div className="top-bar">
                        <div className="profile-pic">
                            <img src={profileMap[this.state.curProfile].image} alt="profile-pic"/>
                        </div>
                        <div className="account-info">
                            <span className="username">{profileMap[this.state.curProfile].username}</span>
                            <span className="handle">{profileMap[this.state.curProfile].handle}</span>
                        </div>
                    </div>
                    <div className="tweet">
                        {this.state.curTweet.text.toLowerCase()}
                    </div>
                </div>
                <div className="score">
                    <span style={{color: this.state.scoreColor}}>
                        {this.state.numCorrect} / {this.state.numGuesses}
                    </span>
                </div>
            </div>
        );
    }
}


ReactDOM.render(
  <Game/>,
  document.getElementById('root')
);


function determineColor(numCorrect, numGuesses) {
    const colors = ['#FF0000', '#FF1000', '#FF2000', '#FF3000', '#FF4000', '#FF5000', '#FF6000', '#FF7000', '#FF8000', '#FF9000', '#FFA000', '#FFB000', '#FFC000', '#FFD000', '#FFE000', '#FFF000', '#FFFF00', '#F0FF00', '#E0FF00', '#D0FF00', '#C0FF00', '#B0FF00', '#A0FF00', '#90FF00', '#80FF00', '#70FF00', '#60FF00', '#50FF00', '#40FF00', '#30FF00', '#20FF00', '#10FF00'];
    if (numGuesses === 0) {
        return '#000000';
    }
    else if (numCorrect === 0) {
        return '#FF0000';
    }
    const rate = Math.round((numCorrect / numGuesses) * (colors.length - 1));
    return colors[rate];
}
