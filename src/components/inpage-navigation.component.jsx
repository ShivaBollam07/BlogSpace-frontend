import React, { useState, useRef, useEffect } from 'react';

const InPageNavigation = ({ routes, defaultActiveIndex = 0, defaultHidden = [], children }) => {
  const activeTabLineRef = useRef(null);

  const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex);

  const changePageState = (btn, i) => {
    const activeTabLine = activeTabLineRef.current;

    if (activeTabLine) {
      const { width, left } = btn.getBoundingClientRect();
      if (width !== undefined && left !== undefined) {
        activeTabLine.style.width = `${width}px`;
        activeTabLine.style.left = `${left}px`;
      }
    }

    setInPageNavIndex(i);
  };

  useEffect(() => {
    const btn = document.querySelectorAll(".relativs button")[inPageNavIndex];
    if (btn && activeTabLineRef.current) {
      const { width, left } = btn.getBoundingClientRect();
      if (width !== undefined && left !== undefined) {
        activeTabLineRef.current.style.width = `${width}px`;
        activeTabLineRef.current.style.left = `${left}px`;
      }
    }
  }, [inPageNavIndex]);

  return (
    <>
      <div className="relativs mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-auto">
        {routes.map((route, i) => (
          <button
            key={i}
            className={`p-4 px-5 capitalize ${inPageNavIndex === i ? "text-black font-bold" : "text-dark-grey"} ${
              defaultHidden.includes(route) ? "md:hidden" : ""
            }`}
            onClick={(e) => changePageState(e.target, i)}
          >
            {route}
          </button>
        ))}
      </div>
      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  );
};

export default InPageNavigation;
