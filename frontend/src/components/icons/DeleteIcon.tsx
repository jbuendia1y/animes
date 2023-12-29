export function DeleteIcon({
  backgroundColor = "none",
  color = "black",
}: {
  backgroundColor?: string;
  color?: string;
}) {
  return (
    <svg
      width="27"
      height="27"
      viewBox="0 0 27 27"
      fill={backgroundColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 21C8 22.1 8.9 23 10 23H18C19.1 23 20 22.1 20 21V11C20 9.9 19.1 9 18 9H10C8.9 9 8 9.9 8 11V21ZM20 6H17.5L16.79 5.29C16.61 5.11 16.35 5 16.09 5H11.91C11.65 5 11.39 5.11 11.21 5.29L10.5 6H8C7.45 6 7 6.45 7 7C7 7.55 7.45 8 8 8H20C20.55 8 21 7.55 21 7C21 6.45 20.55 6 20 6Z"
        fill={color}
      />
    </svg>
  );
}
