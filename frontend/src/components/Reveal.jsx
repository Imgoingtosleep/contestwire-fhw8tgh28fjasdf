import React from "react";
import useInView from "../hooks/useInView";

/** ห่อเนื้อหาให้ค่อย ๆ ปรากฏเมื่อเลื่อนถึง (ใช้คลาส .reveal ใน global.css) */
export default function Reveal({ as: Tag = "div", className = "", children }) {
  const [ref, inView] = useInView({ threshold: 0.15 });
  const classes = ["reveal", inView ? "is-visible" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <Tag ref={ref} className={classes}>
      {children}
    </Tag>
  );
}
