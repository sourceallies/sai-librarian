import React from 'react';
import {FaCheckCircle} from 'react-icons/fa';
import Another from './Another';

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
        if (this.state.complete) {
            return <Another />;
        }

        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start'}}>
                <FaCheckCircle color="green" size={50} />
                <p>{mainText}</p>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <button style={{fontSize: 14, margin: 4}} onClick={() => history.push('/books')}>Continue to Library</button>
                    <button style={{fontSize: 14, margin: 4}} onClick={() => this.setState({complete: true})}>{`${buttonText} Another`}</button>
                </div>
                <p>If you are done close the tab/app</p>
            </div>
        )
    }
}

export default AfterDetails;