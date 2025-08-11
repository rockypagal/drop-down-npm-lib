import { useLayoutEffect } from "react";

export const useDynamicPosition = ({
  dynamicPositioning,
  setMenuPosition,
  mainRef,
  animateTitle,
  search,
  menuOptions,
  titlePosition,
  menuRef,
  handleSetValues,
}) => {
  useLayoutEffect(() => {
    let hasInitialPosition = false;
    const scrollTargets = [];

    const calculatePosition = () => {
      if (!menuRef.current || !mainRef.current) return;

      const viewportHeight = window.innerHeight;
      const mainSectionBRC = mainRef.current.getBoundingClientRect();

      if (!dynamicPositioning) {
        const menuHeight = menuRef.current?.getBoundingClientRect().height || 0;
        const isNotEnoughSpace =
          viewportHeight - (mainSectionBRC.height + mainSectionBRC.top) <
          menuHeight;

        setMenuPosition({
          top: isNotEnoughSpace ? "auto" : `${mainSectionBRC.height + 3}px`,
          ...(isNotEnoughSpace && {
            bottom: `${animateTitle ? "115%" : "103%"}`,
          }),
          visibility: "visible",
        });
      } else {
        const scrollY = window.scrollY;
        const menuElement = menuRef.current;
        const menuHeight = menuElement?.getBoundingClientRect().height || 0;

        setMenuPosition({
          top: `${
            viewportHeight - (mainSectionBRC?.height + mainSectionBRC?.top) <
            menuHeight
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
          visibility: "visible",
        });
      }

      hasInitialPosition = true;
    };

    // Run initial calculation before any paint
    calculatePosition();

    if (dynamicPositioning?.scrollableParentTarget) {
      const { id, className, ref } = dynamicPositioning?.scrollableParentTarget;

      if (id) {
        const el = document.querySelector(
          id.trim().startsWith("#") ? id : "#" + id
        );
        el?.addEventListener("scroll", calculatePosition);
        if (el) scrollTargets.push(el);
      }
      if (className) {
        const el = document.querySelector(
          className.trim().startsWith(".") ? className : "." + className
        );
        el?.addEventListener("scroll", calculatePosition);
        if (el) scrollTargets.push(el);
      }
      if (ref?.current) {
        ref.current.addEventListener("scroll", calculatePosition);
        scrollTargets.push(ref.current);
      }
      window.addEventListener("scroll", calculatePosition);
    }

    window.addEventListener("resize", calculatePosition);

    const resizeObserver = new ResizeObserver(calculatePosition);
    const menuNode = document.getElementById("drop_$_down_$_menu");
    if (menuNode) resizeObserver.observe(menuNode);

    return () => {
      window.removeEventListener("resize", calculatePosition);
      window.removeEventListener("scroll", calculatePosition);
      scrollTargets.forEach((el) =>
        el.removeEventListener("scroll", calculatePosition)
      );
      resizeObserver.disconnect();
    };
  }, [
    search?.searchComplete,
    menuOptions?.length,
    dynamicPositioning,
    animateTitle,
    titlePosition,
    mainRef,
  ]);
};
