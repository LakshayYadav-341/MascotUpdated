import React from 'react';
import { useNavigate } from 'react-router-dom';

const RightContainer = ({
    others,
    tempUser,
    setShowAddressModal,
}) => {
    const navigate = useNavigate();

    return (
        <div className="container-right content">
            {(others || Object.keys(tempUser?.data).includes("profile") || tempUser?.data?.role === "admin") ? null : (
                <button
                    className='btn btn-primary btn-outline'
                    onClick={() => setShowAddressModal(true)}
                >
                    Unlock complete Profile
                </button>
            )}
            {(!others && tempUser?.data?.admin && tempUser?.data?.admin?.role === "institute" && !tempUser?.data?.admin?.institute) ? (
                <button
                    className='btn btn-primary btn-outline'
                    onClick={() => navigate("/institute/create")}
                >
                    Create Institute
                </button>
            ) : null}
        </div>
    );
};

export default RightContainer;
