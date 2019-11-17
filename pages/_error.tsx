import React from 'react';
import PropTypes from 'prop-types';
import { NextComponentType, NextPageContext } from 'next';

import PageMeta from '../components/PageMeta';
import DefaultPageTransitionWrapper from '../components/page-transition-wrappers/Default';

type ErrorPageProps = {
  statusCode: number;
};

const statusCodes: { [code: number]: string } = {
  400: 'Bad Request',
  404: 'This page could not be found',
  405: 'Method Not Allowed',
  500: 'Internal Server Error',
};

const CustomError: NextComponentType<{}, {}, ErrorPageProps> = ({ statusCode }) => {
  const title = statusCodes[statusCode] || 'An unexpected error has occurred';

  return (
    <>
      <PageMeta title={`${statusCode}: ${title}`} description="An error occurred" path="/" />

      <DefaultPageTransitionWrapper>
        <header className="flex flex-col items-center justify-center h-40">
          <h1 className="text-gray-900 text-center text-2xl mb-4">{statusCode}</h1>
          <p className="text-gray-900 text-center text-base">{title}</p>
        </header>
      </DefaultPageTransitionWrapper>
    </>
  );
};

CustomError.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => {
  const statusCode = res && res.statusCode ? res.statusCode : err ? err.statusCode : 404;

  return { statusCode: statusCode || -1 };
};

CustomError.propTypes = {
  statusCode: PropTypes.number.isRequired,
};

export default CustomError;
