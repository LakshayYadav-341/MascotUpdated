import React from "react";
import Footer from "../footer";

const FAQs = () => {
  return (
    <>
      <h1 className="text-gray-300 text-4xl font-bold text-center">
        FAQs
      </h1>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12 lg:px-20 mt-12">
        {/* FAQs Section */}
        <div className="col-span-2 space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <p className="text-gray-300 mb-4">
              <span className="text-blue-400 font-semibold">
                1. What is Mascot?
              </span>
              <br />
              Mascot is a professional networking platform that provides
              opportunities for all members of the global workforce, regardless
              of their goals, ideas, and abilities.
            </p>
            <p className="text-gray-300 mb-4">
              <span className="text-blue-400 font-semibold">
                2. How do I create a Mascot profile?
              </span>
              <br />
              To create a Mascot profile, go to the Mascot website and follow
              the prompts to sign up. You'll be asked to provide information
              about your professional experience, education, and skills, as
              well as to upload a profile photo.
            </p>
            <p className="text-gray-300 mb-4">
              <span className="text-blue-400 font-semibold">
                3. Is Mascot free to use?
              </span>
              <br />
              Mascot offers a basic membership level that is free to use, but
              there are also paid membership options with additional features
              and benefits.
            </p>
            <p className="text-gray-300 mb-4">
              <span className="text-blue-400 font-semibold">
                4. Can I search for jobs on Mascot?
              </span>
              <br />
              Yes, Mascot has a robust job search feature that allows users to
              search for jobs by keyword, location, industry, and other
              criteria.
            </p>
            <p className="text-gray-300 mb-4">
              <span className="text-blue-400 font-semibold">
                5. Can I connect with people I don't know on Mascot?
              </span>
              <br />
              Yes, Mascot encourages users to build their networks by
              connecting with people they don't know, but it's important to
              send personalized invitations and to only connect with people who
              are relevant to your professional goals.
            </p>
            <p className="text-gray-300 mb-4">
              <span className="text-blue-400 font-semibold">
                6. Can I use Mascot to promote my business?
              </span>
              <br />
              Yes, Mascot offers several tools and features for businesses to
              promote their brand and connect with potential customers and
              partners.
            </p>
            <p className="text-gray-300 mb-4">
              <span className="text-blue-400 font-semibold">
                7. How do I get recommendations on Mascot?
              </span>
              <br />
              To get recommendations on Mascot, you can reach out to current
              and former colleagues, supervisors, and other professional
              contacts and ask them to provide a recommendation on your
              profile.
            </p>
            <p className="text-gray-300 mb-4">
              <span className="text-blue-400 font-semibold">
                8. Can I use Mascot to publish articles and other content?
              </span>
              <br />
              Yes, Mascot has a publishing platform that allows users to
              publish articles, blog posts, and other content directly on the
              site.
            </p>
            <p className="text-gray-300 mb-4">
              <span className="text-blue-400 font-semibold">
                9. How can I make my Mascot profile stand out?
              </span>
              <br />
              To make your Mascot profile stand out, make sure to complete your
              profile with detailed information about your professional
              experience and skills, use a professional profile photo, and
              engage with other users by sharing and commenting on their
              content.
            </p>
            <p className="text-gray-300">
              <span className="text-blue-400 font-semibold">
                10. How can I protect my privacy on Mascot?
              </span>
              <br />
              Mascot offers several privacy settings that allow users to
              control who can see their profile and activity on the site, as
              well as to block or report other users who engage in inappropriate
              behavior.
            </p>
          </div>
        </div>
        {/* Footer Section */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <Footer />
        </div>
      </main>
    </>
  );
};

export default FAQs;