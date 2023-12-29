export function NotificationIcon({
  backgroundColor = "none",
  color = "gray",
  width = "27",
  height = "27",
}: {
  backgroundColor?: string;
  color?: string;
  width?: string;
  height?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 27 27"
      fill={backgroundColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_120_90)">
        <path
          d="M16.875 21.375C16.8752 21.9426 16.6608 22.4894 16.2748 22.9056C15.8889 23.3218 15.3598 23.5768 14.7938 23.6194L14.625 23.625H12.375C11.8074 23.6252 11.2606 23.4108 10.8444 23.0248C10.4282 22.6388 10.1732 22.1098 10.1306 21.5437L10.125 21.375H16.875ZM13.5 2.25C15.5419 2.24997 17.5039 3.04301 18.9723 4.46183C20.4406 5.88066 21.3005 7.81435 21.3705 9.855L21.375 10.125V14.3595L23.4248 18.459C23.5142 18.6379 23.559 18.8358 23.5552 19.0357C23.5515 19.2357 23.4993 19.4318 23.4032 19.6071C23.3071 19.7825 23.1699 19.932 23.0034 20.0428C22.8369 20.1536 22.646 20.2224 22.4471 20.2432L22.3178 20.25H4.68226C4.4822 20.2501 4.2851 20.2016 4.10786 20.1088C3.93062 20.016 3.77853 19.8816 3.66461 19.7171C3.55069 19.5527 3.47834 19.363 3.45377 19.1645C3.42919 18.9659 3.45313 18.7644 3.52351 18.5771L3.57526 18.459L5.62501 14.3595V10.125C5.62501 8.03642 6.4547 6.03338 7.93155 4.55653C9.4084 3.07968 11.4114 2.25 13.5 2.25Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_120_90">
          <rect width="27" height="27" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
