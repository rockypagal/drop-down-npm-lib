import { useEffect, useRef } from "react";
import { getSearchOption } from "../../helper/helper";

export const useDebouncedDropdownSearch = ({
  search,
  setSearch,
  options,
  setMenuOptions,
  searchBar,
  maxItems = 100,
}) => {
  const timerRef = useRef(null > null);

  useEffect(() => {
    if (!searchBar || !search?.touched) return;

    setSearch((prev) => ({
      ...prev,
      searchComplete: false,
      totalSearchedResult: [],
    }));

    // External search
    if (typeof searchBar.onSearch === "function") {
      searchBar.onSearch(search.query, options);
      return;
    }

    const delay = typeof searchBar.delay === "number" ? searchBar.delay : 400;

    timerRef.current = setTimeout(() => {
      const query = search.query.replace(/\s+/g, "").toLowerCase();

      if (!query) {
        setMenuOptions(
          options.length > maxItems ? options.slice(0, maxItems) : options
        );
        return;
      }

      const filtered = options.filter((item) =>
        getSearchOption(item).includes(query)
      );

      setMenuOptions(
        filtered.length > maxItems ? filtered.slice(0, maxItems) : filtered
      );

      setSearch((prev) => ({
        ...prev,
        searchComplete: true,
        totalSearchedResult: filtered.length > maxItems ? filtered : filtered,
      }));
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [search.query]);
};
