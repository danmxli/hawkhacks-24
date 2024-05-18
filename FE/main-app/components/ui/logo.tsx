const BlobSVG = (props: any) => {
    return (
        <svg
            {...props}
            id="sw-js-blob-svg"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
        >
            <defs>
                <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">
                    <stop id="stop1" stopColor="rgba(230.781, 74.137, 0, 1)" offset="0%"></stop>
                    <stop id="stop2" stopColor="rgba(251, 168, 31, 1)" offset="100%"></stop>
                </linearGradient>
            </defs>
            <path
                fill="url(#sw-gradient)"
                d="M19.9,-36.7C24.5,-31.9,25.8,-23.8,26.8,-17.1C27.8,-10.5,28.3,-5.2,30.3,1.2C32.3,7.6,35.8,15.1,34.4,21C33,26.9,26.7,31.1,20.1,34.1C13.6,37.2,6.8,39,1.1,37C-4.5,35,-9,29.2,-16,26.5C-23,23.7,-32.5,24,-35.4,20.1C-38.3,16.2,-34.5,8.1,-33.6,0.5C-32.7,-7,-34.6,-14.1,-31.7,-17.8C-28.7,-21.6,-20.9,-22.1,-14.8,-25.9C-8.7,-29.8,-4.3,-37.1,1.7,-40C7.7,-42.9,15.4,-41.5,19.9,-36.7Z"
                width="100%"
                height="100%"
                transform="translate(50 50)"
                strokeWidth="0"
                style={{ transition: 'all 0.3s ease 0s' }}
            ></path>
        </svg>
    );
};

export default BlobSVG;
