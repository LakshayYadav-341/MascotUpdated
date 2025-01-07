import NewsCard from '../cards/newsCard';
import AluminiRequestCard from '../cards/AluminiRequestCard';

const AdminDashboard = ({ role }) => {
    return (
        <>
            {role === 'admin' ? (
                <h1 className="text-gray-300 text-3xl text-center font-bold mt-10">ADMIN</h1>
            ) : (
                <main className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 md:p-10" id="mainContainer">

                    {/* Left Profile Container */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-gray-300 text-xl font-semibold">Add Institute</h2>
                    </div>

                    {/* Center Content */}
                    <div
                        className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-1 md:col-span-2"
                        id="center-content"
                    >
                        <h2
                            className="text-gray-300 text-2xl font-semibold pb-2 mb-6 border-b border-white"
                        >
                            Student to Alumini Requests
                        </h2>
                        <div className="space-y-4">
                            <AluminiRequestCard />
                            <AluminiRequestCard />
                            <AluminiRequestCard />
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg" id="right-content">
                        <h5 className="text-gray-300 text-xl font-semibold mb-4">Mascot News</h5>
                        <NewsCard />
                    </div>
                </main>
            )}
        </>
    );
};

export default AdminDashboard;
