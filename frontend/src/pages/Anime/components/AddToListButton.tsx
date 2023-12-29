import { IconButton, Skeleton } from "@mui/material";
import { UserAnimesService } from "../../../services/user-animes.service";
import { CreateUserAnime } from "../../../models/user-anime.model";
import { useEffect, useState } from "react";

export function AddToListButton({ animeId }: { animeId?: string }) {
  const [{ loading, inList }, setData] = useState({
    loading: true,
    inList: false,
  });

  useEffect(() => {
    if (!animeId) return;
    let subscribe = true;
    const service = new UserAnimesService();
    service.find({ animeId }).then((v) => {
      if (subscribe)
        setData({
          inList: v.values.data.length > 0,
          loading: false,
        });
    });

    return () => {
      subscribe = false;
    };
  }, [animeId]);

  const handleClick = async () => {
    if (!animeId) return;
    const service = new UserAnimesService();
    if (!inList) {
      const data = new CreateUserAnime({ animeId });
      await service.save(data);
      setData({ inList: true, loading: false });
    } else {
      await service.find({ animeId }).then((v) => {
        return service.delete(v.values.data[0].values.id);
      });
      setData({ inList: false, loading: false });
    }
  };

  if (loading)
    return (
      <Skeleton variant="circular">
        <IconButton>
          <svg
            width="22"
            height="20"
            viewBox="0 0 14 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.79435 1.75C7.79435 1.55109 7.70983 1.36032 7.55939 1.21967C7.40894 1.07902 7.2049 1 6.99214 1C6.77937 1 6.57533 1.07902 6.42488 1.21967C6.27444 1.36032 6.18992 1.55109 6.18992 1.75V5H2.71365C2.50089 5 2.29685 5.07902 2.1464 5.21967C1.99596 5.36032 1.91144 5.55109 1.91144 5.75C1.91144 5.94891 1.99596 6.13968 2.1464 6.28033C2.29685 6.42098 2.50089 6.5 2.71365 6.5H6.18992V9.75C6.18992 9.94891 6.27444 10.1397 6.42488 10.2803C6.57533 10.421 6.77937 10.5 6.99214 10.5C7.2049 10.5 7.40894 10.421 7.55939 10.2803C7.70983 10.1397 7.79435 9.94891 7.79435 9.75V6.5H11.2706C11.4834 6.5 11.6874 6.42098 11.8379 6.28033C11.9883 6.13968 12.0728 5.94891 12.0728 5.75C12.0728 5.55109 11.9883 5.36032 11.8379 5.21967C11.6874 5.07902 11.4834 5 11.2706 5H7.79435V1.75Z"
              fill="#1973C8"
            />
          </svg>
        </IconButton>
      </Skeleton>
    );

  return (
    <IconButton
      onClick={handleClick}
      sx={{
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: (theme) => theme.palette.primary.main,
      }}
    >
      {inList ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_104_210)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.773 2.5555C10.9136 2.69615 10.9926 2.88688 10.9926 3.08575C10.9926 3.28463 10.9136 3.47536 10.773 3.616L5.15151 9.2375C5.07722 9.31181 4.98902 9.37075 4.89195 9.41097C4.79488 9.45118 4.69084 9.47188 4.58576 9.47188C4.48069 9.47188 4.37665 9.45118 4.27957 9.41097C4.1825 9.37075 4.0943 9.31181 4.02001 9.2375L1.22701 6.445C1.15538 6.37582 1.09824 6.29306 1.05894 6.20156C1.01963 6.11005 0.998941 6.01164 0.998075 5.91205C0.99721 5.81247 1.01619 5.71371 1.0539 5.62154C1.09161 5.52936 1.1473 5.44563 1.21772 5.37521C1.28814 5.30479 1.37188 5.2491 1.46405 5.21139C1.55622 5.17368 1.65498 5.1547 1.75456 5.15556C1.85415 5.15643 1.95256 5.17712 2.04407 5.21643C2.13557 5.25573 2.21833 5.31287 2.28751 5.3845L4.58551 7.6825L9.71201 2.5555C9.78166 2.48581 9.86436 2.43052 9.95539 2.3928C10.0464 2.35508 10.144 2.33566 10.2425 2.33566C10.341 2.33566 10.4386 2.35508 10.5296 2.3928C10.6207 2.43052 10.7034 2.48581 10.773 2.5555Z"
              fill="#1973C8"
            />
          </g>
          <defs>
            <clipPath id="clip0_104_210">
              <rect width="12" height="12" fill="white" />
            </clipPath>
          </defs>
        </svg>
      ) : (
        <svg
          width="22"
          height="20"
          viewBox="0 0 14 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.79435 1.75C7.79435 1.55109 7.70983 1.36032 7.55939 1.21967C7.40894 1.07902 7.2049 1 6.99214 1C6.77937 1 6.57533 1.07902 6.42488 1.21967C6.27444 1.36032 6.18992 1.55109 6.18992 1.75V5H2.71365C2.50089 5 2.29685 5.07902 2.1464 5.21967C1.99596 5.36032 1.91144 5.55109 1.91144 5.75C1.91144 5.94891 1.99596 6.13968 2.1464 6.28033C2.29685 6.42098 2.50089 6.5 2.71365 6.5H6.18992V9.75C6.18992 9.94891 6.27444 10.1397 6.42488 10.2803C6.57533 10.421 6.77937 10.5 6.99214 10.5C7.2049 10.5 7.40894 10.421 7.55939 10.2803C7.70983 10.1397 7.79435 9.94891 7.79435 9.75V6.5H11.2706C11.4834 6.5 11.6874 6.42098 11.8379 6.28033C11.9883 6.13968 12.0728 5.94891 12.0728 5.75C12.0728 5.55109 11.9883 5.36032 11.8379 5.21967C11.6874 5.07902 11.4834 5 11.2706 5H7.79435V1.75Z"
            fill="#1973C8"
          />
        </svg>
      )}
    </IconButton>
  );
}
