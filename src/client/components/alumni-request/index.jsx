import React from 'react';
import { useGetter } from '../../hooks/fetcher';
import urls, { basePath } from '../../../utils/urls';
import AluminiRequestCard from '../cards/AluminiRequestCard';

const AlumniRequest = () => {
    const { data: requestData, mutate: requestMutate } = useGetter(basePath + urls.request.alumniRequests);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full md:w-3/5 mx-auto mt-10">
            {requestData?.data.length > 0 ? (
                requestData?.data.map((req) => (
                    <AluminiRequestCard
                        key={req.id} // Ensure a unique key
                        requestMutate={requestMutate}
                        cr={req}
                        user={req.from}
                        doc={req.document}
                    />
                ))
            ) : (
                <h3 className="text-gray-300 text-center text-xl font-semibold">No Alumni Requests</h3>
            )}
        </div>
    );
};

export default AlumniRequest;
