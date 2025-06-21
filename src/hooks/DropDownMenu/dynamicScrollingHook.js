import { useEffect, useRef } from "react";

export const useInfiniteScroll = ({
  enabled = true,
  options = [],
  search,
  setMenuOptions,
  lastItemRef,
  chunkSize = 100,
  menuOptions,
}) => {
  const observerRef = useRef(null);

  useEffect(() => {
    if (
      !enabled ||
      options.length < chunkSize ||
      options?.length === menuOptions?.length
    )
      return;

    // Create observer if it doesn't exist
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;

        setMenuOptions((prev) => {
          if (search?.query) {
            return search.totalSearchedResult?.slice(
              0,
              prev.length + chunkSize
            );
          }
          return options?.slice(0, prev.length + chunkSize);
        });

        // Unobserve to avoid repeated triggers
        observerRef.current?.unobserve(entry.target);
      });
    }

    // Start observing the last item
    if (lastItemRef?.current) {
      observerRef.current.observe(lastItemRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [enabled, options, menuOptions, search, lastItemRef?.current]);
};
