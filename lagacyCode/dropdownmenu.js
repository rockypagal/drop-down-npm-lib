// all the lagacy code is from 3.2.4

// search logic

useEffect(() => {
  let id;
  if (searchBar && search?.touched) {
    setSearch({
      ...search,
      searchComplete: false,
      totalSearchedResult: [],
    });
    if (searchBar?.onSearch && checkType(searchBar?.onSearch, "function")) {
      searchBar?.onSearch(search?.query, options);
      return;
    }

    id = setTimeout(
      () => {
        if (!search?.query) {
          if (options?.length > 100) {
            setMenuOptions(options.slice(0, 100));
          } else if (options?.length <= 100) {
            setMenuOptions(options);
          }
          return;
        }

        const arr = options.filter((item) => {
          const newSearchQuery = search?.query
            .replaceAll(" ", "")
            ?.toLowerCase();

          if (item?.searchOptions) {
            return getSearchOption(item)?.includes(newSearchQuery);
          } else {
            return getSearchOption(item)?.includes(newSearchQuery);
          }
        });
        setMenuOptions(arr?.length > 100 ? arr?.slice(0, 100) : arr);
        setSearch({
          ...search,
          searchComplete: true,
          totalSearchedResult: arr?.length > 100 ? arr : [],
        });
      },

      (searchBar?.delay || searchBar?.delay === 0) &&
        checkType(Number(searchBar?.delay), "number")
        ? searchBar?.delay
        : 400
    );
  }
  return () => {
    clearTimeout(id);
  };
}, [search?.query]);

// ---------------------------------------------------------------------------------------------

// old menu position calculation logic

useEffect(() => {
  const calculatePosition = () => {
    const viewportHeight = window.innerHeight;
    const mainSectionBRC = mainRef.current.getBoundingClientRect();
    const menuHeight =
      document.getElementById("drop_$_down_$_menu")?.getBoundingClientRect()
        .height || 0;

    setMenuPosition(
      viewportHeight - (mainSectionBRC.height + mainSectionBRC.top) < menuHeight
    );
  };

  calculatePosition();
  window.addEventListener("resize", calculatePosition);

  return () => window.removeEventListener("resize", calculatePosition);
}, []);

// * optimize this this
// ------------------------------------------------------------------------
// new menu position

useLayoutEffect(() => {
  const calculatePosition = () => {
    const viewportHeight = window.innerHeight;
    const mainSectionBRC = mainRef.current?.getBoundingClientRect();
    const scrollY = window.scrollY;
    const menuElement = document.getElementById("drop_$_down_$_menu");

    const menuHeight = menuElement?.getBoundingClientRect().height || 0;
    menuPosition; // temporary

    setMenuPosition({
      // openUp:
      //   viewportHeight - (mainSectionBRC.height + mainSectionBRC.top) <
      //   menuHeight,

      top: `${
        viewportHeight - (mainSectionBRC?.height + mainSectionBRC?.top) <
        menuElement?.getBoundingClientRect().height
          ? mainSectionBRC?.bottom -
            menuHeight -
            mainSectionBRC?.height -
            3 +
            scrollY +
            (titlePosition
              ? mainRef.current?.firstChild?.getBoundingClientRect()?.height
              : 0)
          : mainSectionBRC?.bottom + 3 + scrollY
      }px`,
      left: `${mainSectionBRC?.left}px`,
      width: `${mainSectionBRC?.width}px`,
    });
  };
  calculatePosition();

  const scrollTargets = [];

  if (scrollListenerTarget) {
    const { id, className, ref } = scrollListenerTarget;

    if (id) {
      const el = document.querySelector(
        id.trim().startsWith("#") ? id : "#" + id
      );
      el?.addEventListener("scroll", calculatePosition);
      if (el) scrollTargets.push(el);
    } else if (className) {
      const el = document.querySelector(
        className.trim().startsWith(".") ? className : "." + className
      );

      el?.addEventListener("scroll", calculatePosition);
      if (el) scrollTargets.push(el);
    } else if (ref.current) {
      ref.current.addEventListener("scroll", calculatePosition);
      scrollTargets.push(ref.current);
    }
  }

  window.addEventListener("resize", calculatePosition);
  window.addEventListener("scroll", calculatePosition);
  const resizeObserver = new ResizeObserver(calculatePosition);
  resizeObserver.observe(document.getElementById("drop_$_down_$_menu"));
  return () => {
    window.removeEventListener("resize", calculatePosition);
    window.removeEventListener("scroll", calculatePosition);
    scrollTargets.forEach((el) =>
      el.removeEventListener("scroll", calculatePosition)
    );
    resizeObserver.disconnect();
  };
}, [
  mainRef.current.getBoundingClientRect().left,
  mainRef.current.getBoundingClientRect().bottom,
  search.searchComplete,
  menuOptions?.length,
]);

// --------------------------------------------------------

// dynamic scrolling logic

const observerRef = useRef(null); // Store the observer instance

useEffect(() => {
  if (options?.length >= 100) {
    // Create the observer only if it doesn't already exist
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((elements) => {
        const label = elements[0];
        if (!label.isIntersecting) return;

        // Add more options when the last label is visible
        setMenuOptions((prev) => {
          if (search?.query) {
            return search.totalSearchedResult?.slice(0, prev.length + 100);
          }
          return options?.slice(0, prev.length + 100);
        });

        // Unobserve the current element after it triggers
        observerRef.current?.unobserve(label.target);
      });
    }

    // Observe the last label if available
    if (lastLabelRef.current) {
      observerRef.current.observe(lastLabelRef.current);
    }
  }

  // Cleanup function
  return () => {
    // Disconnect the observer only on unmount
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null; // Clear the reference
    }
  };
}, [options, menuOptions, setMenuOptions]);

// ----------------------------------------------------------------

// components

// search bar component

{
  searchBar && menuPosition?.top ? (
    <div className="drop-down-search-bar">
      <input
        className={`drop-down-search-input ${checkType(
          inputSearchStyle,
          "string",
          {
            ifTrue: inputSearchStyle,
            ifFalse: "",
          }
        )}`}
        style={{
          ...(inputSearchStyle &&
            checkType(inputSearchStyle, "object") &&
            inputSearchStyle),
        }}
        ref={inputRef}
        autoFocus // ***********
        type="text"
        placeholder={searchBar?.placeholder ?? "search here..."}
        name="search"
        value={search?.query}
        onChange={handleSearch}
        maxLength={80}
        onKeyDown={(e) => {
          if (e.key === "Tab" && showMenu) {
            e.preventDefault();
            handleSetValues({ key: keys?.globalKey });
            focusTheMain(mainRef);
            resetOptionsList({ options, setMenuOptions });
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            e.target.parentElement.nextElementSibling.focus();
          } else if (
            e.key === "Enter" &&
            menuOptions?.length > 0 &&
            search.query &&
            search.touched &&
            search?.searchComplete
          ) {
            const row = menuOptions[0];
            handleSetValues(
              row,
              0,
              options?.length,
              search?.query && search?.touched
            );
            // *******
            focusTheMain(mainRef);
          }
        }}
        onFocus={() => {
          setSearch({ ...search, activeFocus: true });
          if (menuRef.current && menuRef.current.scrollTop > 0) {
            menuRef.current.scrollTop = 0;
          }
        }}
        onBlur={() => {
          setSearch({ ...search, activeFocus: false });
        }}
        autoComplete="off"
      />
    </div>
  ) : null;
}

// ------------------------------------------------------------------

// options component logic

<div
  // className={
  //   "drop-down-item" +
  //   (dropDownValueTwo === row?.value ? " selectedDropBox" : "")
  // }

  className={trim(`drop-down-item ${checkType(optionItemStyle, "string", {
    ifTrue: optionItemStyle,
    ifFalse: "",
  })}
                  ${
                    dropDownValueTwo === row?.value
                      ? checkType(selectedOptionItemStyle, "string", {
                          ifTrue: selectedOptionItemStyle,
                          ifFalse: " selectedDropBox",
                        })
                      : ""
                  }
                  ${
                    index === 0 &&
                    search.query &&
                    search.searchComplete &&
                    document.activeElement === inputRef.current
                      ? " search-active "
                      : ""
                  }
                  
                  `)}
  onClick={() => {
    handleSetValues(
      row,
      index,
      options?.length,
      search?.query && search?.touched
    );
    // *******
    focusTheMain(mainRef);
  }}
  style={{
    ...(optionItemStyle &&
      checkType(optionItemStyle, "object") &&
      optionItemStyle),
    ...(selectedOptionItemStyle &&
      dropDownValueTwo === row?.value &&
      checkType(selectedOptionItemStyle, "object") &&
      selectedOptionItemStyle),
  }}
  tabIndex={0} // ***********
  onKeyDown={(e) =>
    handleKeyDown({
      handleSetValues,
      mainRef,
      options,
      setMenuOptions,
      search,
      menuOptions,
      resetButton,
      dropDownValueTwo,
      searchBar,
      inputRef,
      row,
      index,
      e,
    })
  }
>
  <span
    ref={
      menuOptions?.length >= 100
        ? handleLastLabel(index, menuOptions?.length)
        : null
    }
  >
    {row?.label}
  </span>
</div>;
