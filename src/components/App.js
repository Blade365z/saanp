import React from 'react'
import Board from './Board';

function App() {
    return (
        <div className="ui container">
            <div style={{ justifyContent: 'center', textAlign: 'center', paddingTop: '20px' }}>
                <h3 style={{ textAlign: 'center' , marginBottom:'3px' }}>LETS KILL SOME TIME BRO.</h3>
                <Board />
               

            </div>
            
        </div>
    )
}
export default App;