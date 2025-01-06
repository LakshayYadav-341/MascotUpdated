import React from 'react';
import ProfileComponent from '../../components/profile';

const Index = () => {
  const mockUser = {
    imageUrl: 'path/to/image.jpg',
    firstname: 'John',
    lastname: 'Doe',
    role: 'student',
    bio: 'A short bio about John Doe.',
    workplace: 'Company ABC',
    institute: 'University XYZ',
    joinYear: 2018,
    passYear: 2022,
  };

  const mockProps = {
    user: mockUser
  };

  return (
    <>
      <ProfileComponent {...mockProps} />
    </>
  );
};

export default Index;
