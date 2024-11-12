import classNames from 'classnames';

const classNameGreen = 'text-[#00BB00]';

const Icon_fc_add2 = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      //
      fill="currentColor"
      height="20"
      width="20"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <polygon points="13 7 9 7 9 3 7 3 7 7 3 7 3 9 7 9 7 13 9 13 9 9 13 9 13 7" />
    </svg>
  );
};

const Icon_fc_arrowDone = (props: React.SVGProps<SVGSVGElement>) => {
  const { className } = props;

  return (
    <svg
      fill="currentColor"
      width="20"
      height="20"
      viewBox="0 0 24 29"
      className={classNames(classNameGreen, className)}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M14.563 5.156h-6.719c-0.813 0-1.406 0.625-1.406 1.438v7.813h-5.313c-0.5 0-0.844 0.219-1.063 0.688-0.031 0.156-0.063 0.281-0.063 0.375 0 0.313 0.094 0.594 0.313 0.813l10.125 10.094c0.375 0.469 1.125 0.438 1.563 0l10.094-10.094c0.688-0.625 0.219-1.875-0.813-1.875h-5.344v-7.813c0-0.813-0.563-1.438-1.375-1.438z"></path>
    </svg>
  );
};

const Icon_fc_cancel = (props: React.SVGProps<SVGSVGElement>) => {
  const { className } = props;

  return (
    <svg
      fill="currentColor"
      width="20"
      height="20"
      viewBox="0 0 100 100"
      enableBackground="new 0 0 100 100"
      xmlSpace="preserve"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={classNames(className)}
      {...props}
    >
      <path
        d="M84.707,68.752L65.951,49.998l18.75-18.752c0.777-0.777,0.777-2.036,0-2.813L71.566,15.295
	c-0.777-0.777-2.037-0.777-2.814,0L49.999,34.047l-18.75-18.752c-0.746-0.747-2.067-0.747-2.814,0L15.297,28.431
	c-0.373,0.373-0.583,0.88-0.583,1.407c0,0.527,0.21,1.034,0.583,1.407L34.05,49.998L15.294,68.753
	c-0.373,0.374-0.583,0.88-0.583,1.407c0,0.528,0.21,1.035,0.583,1.407l13.136,13.137c0.373,0.373,0.881,0.583,1.41,0.583
	c0.525,0,1.031-0.21,1.404-0.583l18.755-18.755l18.756,18.754c0.389,0.388,0.896,0.583,1.407,0.583c0.511,0,1.019-0.195,1.408-0.583
	l13.138-13.137C85.484,70.789,85.484,69.53,84.707,68.752z"
      />
    </svg>
  );
};

const Icon_fc_delete = (props: React.SVGProps<SVGSVGElement>) => {
  const { className } = props;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className={classNames(className)}
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4V4zm2 2h6V4H9v2zM6.074 8l.857 12H17.07l.857-12H6.074zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1zm4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1z"
        fill="currentColor"
      />
    </svg>
  );
};

const Icon_fc_edit = (props: React.SVGProps<SVGSVGElement>) => {
  const { className } = props;

  return (
    <svg
      fill="currentColor"
      width="20px"
      height="20px"
      viewBox="0 0 36 36"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={classNames(className)}
      {...props}
    >
      <path d="M4.22,23.2l-1.9,8.2a2.06,2.06,0,0,0,2,2.5,2.14,2.14,0,0,0,.43,0L13,32,28.84,16.22,20,7.4Z"></path>
      <path d="M33.82,8.32l-5.9-5.9a2.07,2.07,0,0,0-2.92,0L21.72,5.7l8.83,8.83,3.28-3.28A2.07,2.07,0,0,0,33.82,8.32Z"></path>
      <rect x="0" y="0" width="36" height="36" fillOpacity="0" />
    </svg>
  );
};

const Icon_fc_export = (props: React.SVGProps<SVGSVGElement>) => {
  const { className } = props;

  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(className)}
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M14,9.00421 C14.5523,9.00421 15,9.45192 15,10.00418 L15,13.00418 C15,14.10878 14.1046,15.00418 13,15.00418 L3,15.00418 C1.89543,15.00418 1,14.10878 1,13.00418 L1,10.00418 C1,9.45192 1.44772,9.00421 2,9.00421 C2.55228,9.00421 3,9.45192 3,10.00418 L3,13.00418 L13,13.00418 L13,10.00418 C13,9.45192 13.4477,9.00421 14,9.00421 Z M8,1.59 L11.7071,5.2971 C12.0976,5.68763 12.0976,6.32079 11.7071,6.71132 C11.3166,7.10184 10.6834,7.10184 10.2929,6.71132 L9,5.41842 L9,10.00418 C9,10.55648 8.55228,11.00418 8,11.00418 C7.44772,11.00418 7,10.55648 7,10.00418 L7,5.41842 L5.70711,6.71132 C5.31658,7.10184 4.68342,7.10184 4.29289,6.71132 C3.90237,6.32079 3.90237,5.68763 4.29289,5.2971 L8,1.59 Z"
      />
    </svg>
  );
};

const Icon_fc_flow = (props: React.SVGProps<SVGSVGElement>) => {
  const { className } = props;

  return (
    <svg
      fill="currentColor"
      width="800px"
      height="800px"
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(className)}
      {...props}
    >
      <path d="M217.45557,38.544a35.9967,35.9967,0,0,0-57.937,40.96679L79.5105,159.51855a36.05906,36.05906,0,0,0-40.96607,7.0254H38.544a36.00029,36.00029,0,1,0,57.93737,9.94531L176.4895,96.48145A35.99663,35.99663,0,0,0,217.45557,38.544ZM72.48584,200.48535a12.00027,12.00027,0,0,1-16.97119-16.9707h-.00049a12.00044,12.00044,0,0,1,16.97168,16.9707Zm128-128a12.01673,12.01673,0,0,1-16.969.00244l-.0022-.00244a12.0001,12.0001,0,1,1,16.97119,0Z" />
    </svg>
  );
};

const Icon_fc_exclam = (props: React.SVGProps<SVGSVGElement>) => {
  const { className } = props;

  return (
    <svg
      fill="currentColor"
      width="20"
      height="20"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(className, 'text-[#0066CC]')}
      {...props}
    >
      <path
        id="Path_21"
        d="M256,512C114.625,512,0,397.391,0,256,0,114.625,114.625,0,256,0S512,114.625,512,256C512,397.391,397.375,512,256,512Zm0-448C149.969,64,64,149.969,64,256s85.969,192,192,192,192-85.969,192-192S362.031,64,256,64ZM224,320h64v64H224Zm0-192h64V288H224Z"
        fillRule="evenodd"
      />
    </svg>
  );
};

const Icon_fc_save = (props: React.SVGProps<SVGSVGElement>) => {
  const { className } = props;

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(className)}
      {...props}
    >
      <g transform="translate(2, 2)">
        <path d="M9 0H0V14L3 14L3 8L11 8L11 14H14V4L9 0Z" fill="currentColor" />
        <path d="M8 14V10H4L4 14H8Z" fill="currentColor" />
      </g>
    </svg>
  );
};

const Icon_fc_search = (props: React.SVGProps<SVGSVGElement>) => {
  const { className } = props;

  return (
    <svg
      fill="currentColor"
      width="20px"
      height="20px"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(className)}
      {...props}
    >
      <path d="M416 448L319 351Q277 383 224 383 181 383 144 362 107 340 86 303 64 266 64 223 64 180 86 143 107 106 144 85 181 63 224 63 267 63 304 85 341 106 363 143 384 180 384 223 384 277 351 319L448 416 416 448ZM223 336Q270 336 303 303 335 270 335 224 335 177 303 145 270 112 223 112 177 112 144 145 111 177 111 224 111 270 144 303 177 336 223 336Z" />
    </svg>
  );
};

const Icon_fc_sentReview = (props: React.SVGProps<SVGSVGElement>) => {
  const { className } = props;

  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(className)}
      {...props}
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M29 3L3 15l12 2.5M29 3L19 29l-4-11.5M29 3L15 17.5"
      />
    </svg>
  );
};

const Icon_fc_sentReviewStop = (props: React.SVGProps<SVGSVGElement>) => {
  const { className } = props;

  return (
    <svg
      width="1024px"
      height="1024px"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      className={classNames(className)}
      {...props}
    >
      <path
        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372 0-89 31.3-170.8 83.5-234.8l523.3 523.3C682.8 852.7 601 884 512 884zm288.5-137.2L277.2 223.5C341.2 171.3 423 140 512 140c205.4 0 372 166.6 372 372 0 89-31.3 170.8-83.5 234.8z"
        fill="#14256a"
      />
    </svg>
  );
};

// const Icon_fc_temp = (props: React.SVGProps<SVGSVGElement>) => {
//   const { className } = props;

// className={classNames(className)}
// {...props}

//   return (

//   )
// };

export {
  Icon_fc_add2,
  Icon_fc_arrowDone,
  Icon_fc_cancel,
  Icon_fc_delete,
  Icon_fc_edit,
  Icon_fc_export,
  Icon_fc_flow,
  Icon_fc_exclam,
  Icon_fc_save,
  Icon_fc_search,
  Icon_fc_sentReview,
  Icon_fc_sentReviewStop,
};
