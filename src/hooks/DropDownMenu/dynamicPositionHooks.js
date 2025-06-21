import { useEffect, useLayoutEffect } from "react";
import { keys } from "../../constant/constant";

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
    const calculatePosition = () => {
      if (!menuRef.current && !mainRef.current) return;

      const viewportHeight = window.innerHeight;
      const mainSectionBRC = mainRef.current.getBoundingClientRect();
      if (!dynamicPositioning) {
        const menuHeight = menuRef.current?.getBoundingClientRect().height || 0;

        // setMenuPosition(
        //   viewportHeight - (mainSectionBRC.height + mainSectionBRC.top) <
        //   menuHeight
        // );
        const isNotEnoughSpace =
          viewportHeight - (mainSectionBRC.height + mainSectionBRC.top) <
          menuHeight;

        setMenuPosition({
          top: isNotEnoughSpace ? "auto" : `${mainSectionBRC.height + 3}px`,
          ...(isNotEnoughSpace && {
            bottom: `${animateTitle ? "115%" : "103%"}`,
          }),
        });

        return;
      } else if (dynamicPositioning) {
        const scrollY = window.scrollY;
        const menuElement = menuRef.current;

        const menuHeight = menuElement?.getBoundingClientRect().height || 0;
        //   menuPosition; // temporary

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
      }
    };
    calculatePosition();

    const scrollTargets = [];

    if (dynamicPositioning?.scrollableParentTarget) {
      const {
        id,
        className,
        ref,
        hideOnScroll = true,
      } = dynamicPositioning?.scrollableParentTarget;

      // function callCal() {
      //   if (hideOnScroll) {
      //     handleSetValues({ key: keys?.globalKey });

      //     return;
      //   }
      //   calculatePosition();
      // }

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
      window.addEventListener("scroll", calculatePosition);
    }

    window.addEventListener("resize", calculatePosition);
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
    search?.searchComplete,
    menuOptions?.length,
    dynamicPositioning,
    animateTitle,
    titlePosition,
    mainRef,
  ]);
};
