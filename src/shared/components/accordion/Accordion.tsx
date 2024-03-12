import React, { useRef, useState } from "react";

const createStyle = (height: number) => {
  const style: React.CSSProperties = {
    maxHeight: `${height}px`,
  };
  return style;
};

interface IAccordiongItemProps {
  title: string;
  children?: React.ReactNode;
}
export const AccordionItem = (props: IAccordiongItemProps) => {
  const { title, children } = props;

  const contentRef = useRef<HTMLDivElement>(null);

  const [isExpanded, setisExpanded] = useState(false);
  const [expandCss, setexpandedCss] = useState<React.CSSProperties>({});

  const toggleExpand = () => {
    const height = !isExpanded ? contentRef.current!.offsetHeight + 200 : 60;
    setexpandedCss(createStyle(height));

    setisExpanded(!isExpanded);
  };

  return (
    <div
      className={`kit-accordion-item ${isExpanded ? "expanded" : ""}`}
      style={expandCss}
    >
      <div className="accordion-header">
        <div className="left">
          <button className="expand-btn kit-icon" onClick={toggleExpand}>
            <span className="icon" uk-icon="plus"></span>
          </button>
          <h6 className="title">
            <span className="title-label">OBJECTIVE</span>
            {title}
          </h6>
        </div>

        <button className="btn-icon">
          <span uk-icon="more-vertical"></span>
        </button>
      </div>

      <div className="content" ref={contentRef}>
        {children}
      </div>
    </div>
  );
};

const Accordion = () => {
  return (
    <div className="kit-accordion">
      <AccordionItem title="Development of WVTC Performance management system">
        <MilestoneItem />
        <MilestoneItem />

        <div className="uk-margin-small uk-text-center">
          <button className="btn-text btn-primary uk-margin-small">
            <span data-uk-icon="icon: plus-circle; ratio:.8"></span> Milestone
          </button>
        </div>
      </AccordionItem>
      <AccordionItem title="Development of WVTC Performance management system">
        <MilestoneItem />

        <div className="uk-margin-small uk-text-center">
          <button className="btn-text btn-primary uk-margin-small">
            <span data-uk-icon="icon: plus-circle; ratio:.8"></span> Milestone
          </button>
        </div>
      </AccordionItem>
    </div>
  );
};

export default Accordion;

const MilestoneItem = () => {
  return (
    <div className="milestone uk-card">
      <div className="uk-grid-small uk-grid-match" data-uk-grid>
        <div className="uk-width-expand">
          <h6 className="milestone-name">
            Customer Portal - web portal for customers of Sales and Marketing/
            Supply & Distribution business units to tr...
          </h6>
        </div>

        <div>
          <p className="milestone-baseline">10</p>
        </div>

        <div>
          <p className="milestone-progress">10</p>
        </div>

        <div>
          <p className="milestone-target">10</p>
        </div>

        <div>
          <p className="milestone-date">10 Oct 2022</p>
        </div>

        <div className="uk-text-right">
          <div className="controls">
            <button className="btn-icon uk-margin-small-right">
              <span uk-icon="pencil"></span>
            </button>
            <button className="btn-icon">
              <span uk-icon="trash"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface IHeadProp {
  title: JSX.Element;
  children?: JSX.Element;
}
export const CustomCloseAccordion = ({ title, children }: IHeadProp) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const onClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="custom-made-accordion">
      <div className="position-relative">
        <div onClick={onClick}>{title}</div>
        <div className="more">
          <span
            onClick={onClick}
            className={`icon ${isExpanded ? "expanded" : ""}`}
            data-uk-icon="triangle-down"
          ></span>
        </div>
      </div>
      <div className={`custom-accordion ${isExpanded ? "expanded" : ""}`}>
        {children}
      </div>
    </div>
  );
};
