import { useCallback, useEffect, useRef, useState } from "react";

export function usePaginate(
  initialState: {
    totalItems: number;
    pageSize: number;
  } = { totalItems: 1, pageSize: 10 }
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(
    Math.ceil(initialState.totalItems / initialState.pageSize)
  );
  const pageSize = useRef(initialState.pageSize);
  const [totalItems, setTotalItems] = useState(initialState.totalItems);

  useEffect(() => {
    console.log({ totalItems: totalItems, pageSize: pageSize.current });
    setTotalPages(Math.ceil(totalItems / pageSize.current));
  }, [totalItems, pageSize]);

  const changePageSize = useCallback((value: number) => {
    pageSize.current = value;
  }, []);
  const changeTotalItems = useCallback((value: number) => {
    setTotalItems(value);
  }, []);

  /**
   *
   * @param value Starts with 1 and ends in options.totalItems value
   */
  const changePage = (value: number) => {
    if (value === 0 || value > totalPages) return;
    setCurrentPage(value);
  };

  const next = () => {
    if (totalPages === currentPage) return;
    setCurrentPage((v) => v++);
  };

  const prev = () => {
    if (currentPage === 1) return;
    setCurrentPage((v) => v--);
  };

  return {
    currentPage,
    totalItems,
    totalPages,
    pageSize,
    changePage,
    changePageSize,
    changeTotalItems,
    next,
    prev,
  };
}
