import { useCallback, useEffect, useRef, useState } from "react";
import { TagsService } from "../../services/tags.service";
import { Tag } from "../../models/tag.model";

interface Data {
  tags: Tag[] | null;
  loading: boolean;
}

export function usePaginateTags() {
  const [{ tags, loading }, setData] = useState<Data>({
    tags: null,
    loading: true,
  });
  const [total, setTotal] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageLoadeds = useRef<number[]>([]);

  useEffect(() => {
    let subscribe = true;
    const service = new TagsService();
    if (pageLoadeds.current.some((v) => v === currentPage)) return;

    service
      .find({
        limit: 25,
        offset: (currentPage - 1) * 25,
      })
      .then((res) => {
        if (!subscribe) return;
        setTotal(res.values.meta.total);
        setData((prev) => ({
          tags: (prev.tags ? prev.tags : []).concat(res.values.data),
          loading: false,
        }));
        pageLoadeds.current.push(currentPage);
      });
    return () => {
      subscribe = false;
    };
  }, [currentPage]);

  const goTo = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return { tags, loading, total, currentPage, goTo };
}
