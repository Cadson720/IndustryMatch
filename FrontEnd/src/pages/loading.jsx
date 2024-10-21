import React, { useState, useEffect } from 'react';
import Loading from '../components/loader.jsx';

const Page = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a page load delay for demo purposes
    setTimeout(() => {
      setLoading(false);
    }, 3000); // 3 second delay
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Page Content Loaded</h1>
    </div>
  );
};

export default Page;