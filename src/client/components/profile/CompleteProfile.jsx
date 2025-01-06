import React from 'react'

export default function CompleteProfile() {
    return (
        <div className='formContainer card'>
            <div id='detailForm'>
                <h2>Address Details</h2>
                <div className="twoInput">
                    <div className="div">
                        <input type="text" name="name" placeholder='Name' id="name" required />
                    </div>
                    <div className="div">
                        <input type="text" name="buildingName" placeholder='Building Name' id="buildingName" />
                    </div>
                </div>
                <div className="oneInput">
                    <input type="text" name="line1" placeholder='Address Line 1' id='line1' required />
                </div>
                <div className="oneInput">
                    <input type="text" name="line2" placeholder='Adress Line 2' id='line' />
                </div>
                <div className="oneInput">
                    <input type="text" name="street" placeholder='Street name' id='street' required />
                </div>
                <div className="twoInput">
                    <div className="div">
                        <input type="text" name='city' placeholder='city' id='city' required />
                    </div>
                    <div className="div">
                        <input type="text" name="state" placeholder='State' id="state" required />
                    </div>
                </div>
                <div className="twoInput">
                    <div className="div">
                        <input type="text" name="country" placeholder='country' id="country" required />
                    </div>
                    <div className="div">
                        <input type="number" name="pinCode" placeholder='Pin Code' id="pinCode" required />
                    </div>
                </div>
            </div>
        </div>
    )
}
