import React, { Fragment, useCallback, useEffect, useRef, useState, } from "react";

interface IContextMenuOptionProps {
  children: any;
  onClick: () => void;
  disabled?: boolean;
  success?: boolean;
}
export const ContextMenuOption = (props: IContextMenuOptionProps) => {
  const { children, onClick, success, disabled } = props;

  const cssClass = disabled
    ? "context-menu--option context-menu--option__disabled"
    : success
      ? "context-menu--option context-menu--option__success"
      : "context-menu--option";

  return (
    <button className={cssClass} onClick={onClick}>
      {children}
    </button>
  );
};

interface IContextMenuProps {
  options: React.ReactNode;
  children: React.ReactNode;
}
const ContextMenu = (props: IContextMenuProps) => {
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const _handleContextMenu = (event: any) => {
    event.preventDefault();
    setVisible(true);

    if (!rootRef.current) return;

    const clickX = event.clientX;
    const clickY = event.clientY;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const rootW = rootRef.current.offsetWidth;
    const rootH = rootRef.current.offsetHeight;

    const right = screenW - clickX > rootW;
    const left = !right;
    const top = screenH - clickY > rootH;
    const bottom = !top;

    if (right) rootRef.current.style.left = `${clickX + 5}px`;
    if (left) rootRef.current.style.left = `${clickX - rootW - 5}px`;
    if (top) rootRef.current.style.top = `${clickY + 5}px`;
    if (bottom) rootRef.current.style.top = `${clickY - rootH - 5}px`;
  };

  const _handleClick = useCallback(
    (event: any) => {
      if (!rootRef.current) return;
      const wasOutside = !rootRef.current.contains(event.target);
      if (wasOutside && visible) setVisible(false);
    },
    [visible]
  );

  // const _handleScroll = () => {
  //   if (visible) setVisible(false);
  // };

  useEffect(() => {
    document.addEventListener("mousedown", _handleClick); // Bind the event listener
    return () => {
      document.removeEventListener("mousedown", _handleClick); // Unbind the event listener on clean up
    };
  }, [_handleClick]);

  return (
    <Fragment>
      <div
        className="contenxt-menu-agent"
        onContextMenu={_handleContextMenu}
      // onScroll={_handleScroll}
      >
        {props.children}
      </div>

      <div ref={rootRef} className="context-menu">
        {(visible || null) && (
          <div className="context-menu__options">{props.options}</div>
        )}
      </div>
    </Fragment>
  );
};

export default ContextMenu;
