const errorCodes = {
    BAD_REQUEST: {
      status: 400,
      message:
        'Bad Request. The server cannot process the request due to a client error.',
    },
    UNAUTHORIZED: {
      status: 401,
      message: [
        'Unauthorized. You must authenticate before accessing this resource.',
        'Invalid Password',
        'Invalid Otp',
      ],
    },
    FORBIDDEN: {
      status: 403,
      message: "Forbidden. You don't have permission to access this resource.",
    },
    NOT_FOUND: {
      status: 404,
      message: 'User Does not exist.',
    },
    CONFLICT: {
      status: 409,
      message: [
        'Email already exists , Please use different email',
        'Email already verified',
      ],
    },
    GONE: {
      status: 410,
      message: 'Otp expired , Please resend again',
    },
    INTERNAL_SERVER_ERROR: {
      status: 500,
      message: 'Internal Server Error. Something went wrong on the server.',
    },
    SERVICE_UNAVAILABLE: {
      status: 503,
      message:
        'Service Unavailable. The server is currently unable to handle the request.',
    },
  };
  
  module.exports = errorCodes;
  