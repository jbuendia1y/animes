import { Modal, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { NewVideoButton, VideoCard } from ".";
import { useEffect, useState } from "react";
import { ChapterVideoService } from "../../../services";
import { ChapterVideo } from "../../../models";

export function ListProvidersModal({
  open,
  onClose,
  chapterId,
}: {
  chapterId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [{ videos, loading }, setData] = useState<{
    videos: ChapterVideo[] | null;
    loading: boolean;
  }>({ videos: null, loading: true });

  useEffect(() => {
    let subscribe = true;

    const service = new ChapterVideoService();
    service.find({ chapterId }).then((v) => {
      if (subscribe) setData({ videos: v, loading: false });
    });

    return () => {
      subscribe = false;
    };
  }, [chapterId]);

  return (
    <Modal open={open} onClose={onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",

          width: "90%",
          maxHeight: "90vh",
          minWidth: "300px",
          maxWidth: "500px",

          overflow: "auto",

          padding: 2,
        }}
      >
        <Typography component="h1" variant="h4" fontWeight="bold">
          Lista de videos
        </Typography>
        <NewVideoButton chapterId={chapterId} />
        <Stack>
          {loading ? (
            <>
              <Skeleton>
                <VideoCard
                  data={{
                    chapterId: "cargando",
                    embedURL: "https://google.com",
                    id: "cargando",
                    player: "cargando",
                    provider: "cargando",
                    videoURL: "https://google.com",
                  }}
                />
              </Skeleton>
              <Skeleton>
                <VideoCard
                  data={{
                    chapterId: "cargando",
                    embedURL: "https://google.com",
                    id: "cargando",
                    player: "cargando",
                    provider: "cargando",
                    videoURL: "https://google.com",
                  }}
                />
              </Skeleton>
              <Skeleton>
                <VideoCard
                  data={{
                    chapterId: "cargando",
                    embedURL: "https://google.com",
                    id: "cargando",
                    player: "cargando",
                    provider: "cargando",
                    videoURL: "https://google.com",
                  }}
                />
              </Skeleton>
            </>
          ) : videos ? (
            videos.map((v) => (
              <VideoCard
                key={"admin-ui-list-videos-" + v.values.id}
                data={v.values}
              />
            ))
          ) : (
            <p>No hay videos</p>
          )}
        </Stack>
      </Paper>
    </Modal>
  );
}
