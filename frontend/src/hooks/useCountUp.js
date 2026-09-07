import { useEffect, useRef, useState } from "react";

/**
 * อนิเมชันตัวเลขวิ่งจาก 0 ไปยังค่าเป้าหมาย ด้วย requestAnimationFrame (60fps)
 * เขียนเองแทนการใช้ CountUp.js เพื่อไม่เพิ่ม dependency
 *
 * @param {number} target   ค่าเป้าหมาย
 * @param {boolean} active  เริ่มนับเมื่อเป็น true (เช่น เมื่อ element เข้าสู่หน้าจอ)
 * @param {number} duration ระยะเวลา (ms)
 * @returns {number} ค่าปัจจุบันระหว่างการนับ
 */
export default function useCountUp(target, active = true, duration = 1600) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return undefined;
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || !target) {
      setValue(target || 0);
      return undefined;
    }

    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo — วิ่งเร็วตอนต้นแล้วค่อย ๆ ช้าลง
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, active, duration]);

  return value;
}
