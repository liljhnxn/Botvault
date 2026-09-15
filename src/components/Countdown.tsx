"use client";

import { useEffect, useState } from "react";

function parts(target: bigint) { const seconds = Math.max(0, Number(target) - Math.floor(Date.now() / 1000)); return { days: Math.floor(seconds / 86400), hours: Math.floor(seconds % 86400 / 3600), minutes: Math.floor(seconds % 3600 / 60), seconds: seconds % 60 }; }
export default function Countdown({ unlockTime }: { unlockTime: bigint }) { const [time, setTime] = useState(() => parts(unlockTime)); useEffect(() => { const timer = setInterval(() => setTime(parts(unlockTime)), 1000); return () => clearInterval(timer); }, [unlockTime]); if (!time.days && !time.hours && !time.minutes && !time.seconds) return <span className="text-[var(--accent)]">Ready to withdraw</span>; return <span>{time.days}d {String(time.hours).padStart(2, "0")}h {String(time.minutes).padStart(2, "0")}m {String(time.seconds).padStart(2, "0")}s</span>; }
