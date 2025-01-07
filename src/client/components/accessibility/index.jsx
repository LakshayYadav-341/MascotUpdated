import React from 'react';
import Footer from '../footer';

const Accessibility = () => {
    return (
        <>
            <h1 className="text-gray-300 w-11/12 mx-auto text-center text-4xl md:text-5xl font-bold">
                Accessibility
            </h1>
            <main className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-10 mt-10">
                <div className="md:col-span-2">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h2 className="text-gray-300 text-2xl font-semibold mb-4 leading-tight">
                            Mascot is a platform that aims to provide equal opportunities for all members of the global workforce.
                        </h2>
                        <h4 className="text-gray-400 text-lg mb-6">
                            Whether you are looking for a job or trying to network with like-minded professionals, Mascot's community is designed to be inclusive and diverse.
                        </h4>
                        <h5 className="text-gray-300 text-base mb-4">
                            The platform understands that every member has unique goals, ideas, and abilities, and it is committed to making accessibility and inclusive design a part of its core principles.
                        </h5>
                        <p className="text-gray-300 text-base mb-6">
                            One of the main features that sets Mascot apart is its commitment to accessibility. The platform has been built from the ground up to ensure that everyone can use it, regardless of any physical or cognitive disabilities they may have. Mascot has integrated several accessibility features into its design to make it easier for everyone to use the platform.
                        </p>
                        <p className="text-gray-300 text-base mb-6">
                            Mascot has incorporated keyboard navigation into its platform, making it possible for users to navigate the platform using only their keyboard. This feature is especially helpful for users who cannot use a mouse or other pointing device to access the platform's features.
                        </p>
                        <p className="text-gray-300 text-base mb-6">
                            Another important accessibility feature is keyboard navigation and screen reader compatibility. Mascot has also implemented several other accessibility features, including alt text descriptions for images and closed captions for videos. All of these features are designed to make it easier for users with disabilities to access the platform's content and features.
                        </p>
                        <p className="text-gray-300 text-base mb-6">
                            Mascot is also committed to continuous improvement of its accessibility features. The platform's teams are constantly working to improve the user experience for all its products. They welcome feedback from members and customers to make the platform even better. If a member encounters an accessibility bug or has difficulty using Mascot's products with assistive technology, they can contact the platform for assistance.
                        </p>
                        <p className="text-gray-300 text-base">
                            Mascot recognizes that accessibility is not just a checkbox to tick off; it is an ongoing process. The platform is always looking for ways to improve its accessibility features, and it believes that this journey is a collaborative effort between its teams and its members. Mascot's commitment to accessibility is reflected in its efforts to build an inclusive and accessible community, where all members can connect and advance their professional goals.
                        </p>
                    </div>
                </div>
                <div>
                    <Footer />
                </div>
            </main>
        </>
    );
};

export default Accessibility;