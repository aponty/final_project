import React from 'react';
// import GameScript from './GameScript';

class Content extends React.Component {

    componeneDidMount() {
         var embedCode = "<script>console.log('does this work')</script>";
         window.querySelector('button').appendChild(embedCode)
    }

    render () {
        return(
            <div>
                <canvas className='canvas'></canvas>
                <button className='logout' onClick={this.props.logout}>Click here to log out!</button>
                {/* <GameScript/> */}
            </div>
        )
    }
}

export default Content;
