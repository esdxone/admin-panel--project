import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function LoadingSpinner({active}) {
  return (
    <>
      <div className={active ? 'fixed-spinner active' : 'fixed-spinner'}>
        <Spinner animation="border" variant="light" />
      </div>
    </>
  )
}

export default LoadingSpinner;