import React from "react";
import Footer from "../footer";

const AboutUs = () => {
  return (
    <div className="bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 pt-20 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12">
          About us
        </h1>
        
        <div className="grid md:grid-cols-[2fr,1fr] gap-8">
          <div className="space-y-6 bg-gray-800 rounded-lg p-6 shadow-lg">
            <p>
              Welcome to our professional mascot app, where you can connect with
              like-minded individuals, post your thoughts and ideas, and apply
              for jobs to take your career to the next level.
            </p>
            
            <p>
              Join our professional social media app today and start building
              valuable connections, sharing your expertise, and taking your
              career to the next level. We are dedicated to helping
              professionals like you achieve your goals and succeed in your
              chosen field.
            </p>

            <p>
              At our app, we believe that every individual has something
              valuable to contribute to the professional world, and our platform
              is designed to help you showcase your skills, connect with
              potential employers, and grow your network.
            </p>

            <p>
              With our powerful search and filter tools, you can find and
              connect with individuals and companies in your industry, discover
              new job opportunities, and stay up-to-date with the latest trends
              and news in your field.
            </p>

            <p>
              Our user-friendly interface makes it easy to create a detailed
              profile that highlights your skills, experience, and achievements,
              and showcase your portfolio to potential employers. You can also
              share your thoughts and insights through our blog and forums,
              engage in meaningful discussions with other professionals, and
              build your reputation as a thought leader in your industry.
            </p>

            <p>
              Whether you're looking for your next career move or seeking to
              expand your network, our professional social media app is the
              perfect platform to help you achieve your goals. Join us today and
              take the first step towards building a successful career in your
              chosen field.
            </p>

            <p>
              valuable connections with other professionals by participating in
              our networking events and groups. Our platform provides a range of
              options for you to connect with others based on common interests,
              industry, or location. You can also use our messaging feature to
              connect with individuals one-on-one and build meaningful
              relationships with potential employers, mentors, or collaborators.
            </p>

            <p>
              Our app also provides a comprehensive job search feature that
              allows you to browse through thousands of job openings across
              various industries, and apply for positions that match your
              skillset and experience. You can also set up job alerts to stay
              updated on the latest job opportunities that match your
              preferences.
            </p>

            <p>
              We believe that a strong professional network is key to success,
              and our app provides you with the tools and resources you need to
              grow your network and advance your career. Our app is designed to
              be user-friendly and intuitive, making it easy for you to navigate
              and explore all the features and benefits of our platform.
            </p>
          </div>

          <div className="md:mt-0 mt-8">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;