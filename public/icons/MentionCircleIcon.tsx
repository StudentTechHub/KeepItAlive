type MentionCircleProps = {
  colors?: string;
} & React.SVGProps<SVGSVGElement>;

export const MentionCircle = ({ colors, ...props }: MentionCircleProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      {...props}
    >
      <g id="Linear / Essentional, UI / Mention Circle" clipPath="url(#clip0_224_983)">
        <path
          id="Vector"
          d="M10 15C7.23858 15 5 12.7614 5 10C5 7.23858 7.23858 5 10 5C12.7614 5 15 7.23858 15 10C15 10.6013 14.8939 11.1777 14.6993 11.7117C14.6292 11.9041 14.5062 12.0717 14.3557 12.2106L14.2886 12.2725C13.8259 12.6994 13.1311 12.7541 12.6073 12.4049C12.2279 12.1519 12 11.7261 12 11.2701V10M12 10C12 11.1046 11.1046 12 10 12C8.89543 12 8 11.1046 8 10C8 8.89543 8.89543 8 10 8C11.1046 8 12 8.89543 12 10Z"
          stroke="#BBBBBB"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          id="Vector_2"
          d="M1.6665 9.99984C1.6665 5.39746 5.39746 1.6665 9.99984 1.6665C14.6022 1.6665 18.3332 5.39746 18.3332 9.99984C18.3332 14.6022 14.6022 18.3332 9.99984 18.3332C5.39746 18.3332 1.6665 14.6022 1.6665 9.99984Z"
          stroke="#BBBBBB"
          strokeWidth="1.5"
        />
      </g>
      <defs>
        <clipPath id="clip0_224_983">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
