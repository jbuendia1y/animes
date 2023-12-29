import { Skeleton, Stack } from "@mui/material";
import { ProviderItem } from "./ProviderItem";
import { usePlayer } from "../contexts";

export function ProvidersList() {
  const { videos, loading, selectPlayer } = usePlayer();

  if (loading) return <Skeleton variant="rectangular" height={50} />;

  return (
    <Stack
      display="inline-flex"
      direction="row"
      overflow="auto"
      maxWidth="100%"
      sx={{ borderRadius: 1000 }}
    >
      {videos?.length === 0 ? (
        <p>No tiene videos ha escoger</p>
      ) : (
        videos?.map((v) => (
          <ProviderItem
            key={"provider-" + v.provider}
            onSelect={selectPlayer}
            provider={v.provider}
            players={v.players}
          />
        ))
      )}
      {/*       <ProviderItem
        provider="AnimeFenix"
        players={[
          {
            player: "Mp4Upload",
            embedUrl: "https://www.mp4upload.com/embed-zrdtlhqb42t7.html",
            videoUrl: "https://www.mp4upload.com/zrdtlhqb42t7",
          },
        ]}
      />
      <ProviderItem
        provider="AnimeFlv.vc"
        players={[
          {
            player: "MoonPlayer",
            embedUrl: "https://moonplayer.lat/e/ewh6va83qk9g",
            videoUrl: "https://filemoon.sx/download/ewh6va83qk9g",
          },
        ]}
      /> */}
    </Stack>
  );
}
