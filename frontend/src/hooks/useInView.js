import { useEffect, useRef, useState } from "react";

/**
 * ตรวจจับว่า element เข้าสู่พื้นที่มองเห็นแล้วหรือยัง (IntersectionObserver)
 * ใช้สำหรับ trigger อนิเมชันตัวเลขวิ่งและ reveal on scroll
 *
 * @param {object} options  { threshold, rootMargin, once }
 * @returns {[React.RefObject, boolean]} [ref ที่ต้องผูกกับ element, สถานะมองเห็น]
 */
export default function useInView({
  threshold = 0.25,
  rootMargin = "0px 0px -10% 0px",
  once = true,
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}
