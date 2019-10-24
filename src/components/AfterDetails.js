import React from 'react';
import {FaCheckCircle} from 'react-icons/fa';

class AfterDetails extends React.Component {

    constructor() {
        super();
        this.state = {
            complete: false
        }
    }
    render() {
        const {history, isReturning, title} = this.props;
        const mainText = isReturning ? `${title} has been returned` : `You have checked out ${title}`;
        const buttonText = isReturning ? "Return" : "Check Out";

        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', marginTop: '40px'}}>
                <FaCheckCircle color="#2AF598" size={100} />
                <h3>{mainText}</h3>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <button style={{fontSize: 20, margin: 10, width: 250}} onClick={() => history.push('/books')}>Continue to Library</button>
                    </div>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <button style={{fontSize: 20, margin: 10, width: 250, color: "#2185d0", backgroundColor: "#EAEAEA"}} onClick={() => this.setState({complete: true})}>{`${buttonText} another book`}</button>
                </div>
                <p>If you are done close the tab/app</p>
            </div>
        )
    }
}

export default AfterDetails;