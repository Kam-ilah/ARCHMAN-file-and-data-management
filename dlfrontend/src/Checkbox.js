import React, {Component} from 'react';


const Checkbox = () => {
    const [checked, setChecked] = React.useState(false);

    const handleChange = () => {
        setChecked(!checked);
      };
    return(
        <div>
            <label>
                <input 
                type='checkbox' 
                checked={checked}
                onChange={handleChange}
                />
                My value
            </label>
            {/* <p>is "my value" checked? {checked.toString()}</p> */}
        </div>
    );
}

export default Checkbox;