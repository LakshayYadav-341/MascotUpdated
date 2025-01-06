import React from 'react'

export default function AddressModal({tempUser}) {
    return (
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Address Information</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <div className="mb-2">
                        Name : {`${tempUser?.data?.profile?.address.name}`}
                    </div>
                    {tempUser?.data?.profile?.address.buildingName !== "" && <div className="mb-2">
                        Building Name : {tempUser?.data?.profile?.address.buildingName}
                    </div>}

                    <div className="mb-2">
                        Street : {tempUser?.data?.profile?.address.street}
                    </div>
                    <div className="mb-2">
                        Address Line 1 : {tempUser?.data?.profile?.address.line1}
                    </div>
                    {
                        tempUser?.data?.profile?.address.line2 &&
                        <div className="mb-2">
                            Address Line 2 : {tempUser?.data?.profile?.address.line2}
                        </div>
                    }
                    <div className="mb-2">
                        City : {tempUser?.data?.profile?.address.city}
                    </div>
                    <div className="mb-2">
                        Pincode : {tempUser?.data?.profile?.address?.pinCode}
                    </div>
                    <div className="mb-2">
                        State : {tempUser?.data?.profile?.address?.state}
                    </div>
                    <div className="mb-2">
                        Country : {tempUser?.data?.profile?.address?.country}
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    )
}