import { Skeleton, Stack } from "@mui/material";
import { ChapterItem } from "./ChapterItem";
import { useEffect, useState } from "react";
import { Chapter } from "../../../models/chapter.model";
import { ChaptersService } from "../../../services/chapters.service";

interface Props {
  animeId: string;
}

export function ChaptersList({ animeId }: Props) {
  const [{ chapters, loading }, setData] = useState<{
    chapters: Array<Chapter> | null;
    loading: boolean;
  }>({ chapters: null, loading: true });

  useEffect(() => {
    let subscribe = true;
    const service = new ChaptersService();
    service.find({ animeId }).then((v) => {
      if (subscribe) setData({ chapters: v.values.data, loading: false });
    });

    return () => {
      subscribe = false;
    };
  }, [animeId]);

  if (loading)
    return (
      <Stack spacing={1.5}>
        <Skeleton variant="rectangular" height={60} />
        <Skeleton variant="rectangular" height={60} />
        <Skeleton variant="rectangular" height={60} />
        <Skeleton variant="rectangular" height={60} />
      </Stack>
    );

  if (!chapters || chapters.length === 0)
    return <p>Este anime no tiene episodios todavía</p>;

  return (
    <Stack spacing={1.5}>
      {chapters?.map((v) => (
        <ChapterItem
          key={"chapterItem-" + v.values.canonicalTitle}
          id={v.values.id}
          title={v.values.canonicalTitle}
          airdate={v.values.airdate}
          number={v.values.number}
          thumbnail={v.values.thumbnail}
        />
      ))}
    </Stack>
  );
}
