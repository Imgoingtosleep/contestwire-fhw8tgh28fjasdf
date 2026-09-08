import { useEffect, useRef, useState } from "react";

/**
 * อนิเมชันตัวเลขวิ่งจากค่าเริ่มต้นไปยังค่าเป้าหมาย ด้วย requestAnimationFrame (60fps)
 * เขียนเองแทนการใช้ CountUp.js เพื่อไม่เพิ่ม dependency
 *
 * รองรับทั้งนับขึ้น (from < target) และนับถอยลง (from > target)
 *
 * @param {number} target   ค่าเป้าหมาย
 * @param {boolean} active  เริ่มนับเมื่อเป็น true (เช่น เมื่อ element เข้าสู่หน้าจอ)
 * @param {number} duration ระยะเวลา (ms)
 * @param {number} from     ค่าเริ่มต้น (ค่าเริ่มต้น 0)
 * @returns {[number, boolean]} [ค่าปัจจุบัน, นับถึงเป้าหมายแล้วหรือยัง]
 */
export default function useCountUp(target, active = true, duration = 1600, from = 0) {
  const [value, setValue] = useState(from);
  const [done, setDone] = useState(false);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!active) {
      setValue(from);
      setDone(false);
      return undefined;
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced || target === from) {
      setValue(target || 0);
      setDone(true);
      return undefined;
    }

    setDone(false);
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo — วิ่งเร็วตอนต้นแล้วค่อย ๆ ช้าลง
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setValue(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [target, active, duration, from]);

  return [value, done];
}
