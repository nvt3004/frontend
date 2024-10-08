import React, { useEffect, useRef } from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";

const FramerMotionCollapse = ({ children, open, rest }) => {
  const animate = {
    transition: { type: "tween", duration: 0.5 },
    height: open ? "auto" : 0
    //opacity: open ? 1 : .5
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <div aria-expanded={open} {...rest}>
        <m.div
          style={{ overflow: "hidden" }}
          initial={{ height: 0, opacity: 1 }}
          animate={animate}
          exit={{ height: 0, opacity: 1 }}
        >
          {children}
        </m.div>
      </div>
    </LazyMotion>
  );
};

export default FramerMotionCollapse;