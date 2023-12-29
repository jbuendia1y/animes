export function LogoutIcon({
  backgroundColor = "none",
  color = "gray",
  width = "27",
  height = "27",
  strokeWidth = "4",
}: {
  backgroundColor?: string;
  color?: string;
  width?: string;
  height?: string;
  strokeWidth?: string;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 27 27"
      fill={backgroundColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13.4953 3.375H3.375V23.625H13.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.5625 18.5625L23.625 13.5L18.5625 8.4375"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 13.4953H23.625"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
