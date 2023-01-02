import React, {useState} from 'react';

function Button({generateToken}){
    
    
return(
    <div>
    <button onClick={generateToken}>Generate Token</button>
    </div>
)
}
export default Button;