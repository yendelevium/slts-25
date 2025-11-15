import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useQuery } from "@tanstack/react-query";

// Fetch events map for a given district and group -> for fast look-ups to see already taken events :)
export async function fetchEventsMap(district: string, group: string) {
  const colRef = collection(db, "register");

  // Query 1: same district + same group  -> individual event -> count
  const q1 = query(
    colRef,
    where("district", "==", district),
    where("group", "==", group),
  );

  const snap1 = await getDocs(q1);
  const individualEventMap: Record<string, number> = {};

  snap1.forEach((doc) => {
    const d = doc.data();
    const add = (v?: string) => {
      if (!v || v.trim() === "") return;
      individualEventMap[v] = 1;
    };

    add(d.individualChoice1);
    add(d.individualChoice2);
  });

  // Query 2: same district + ANY group -> count ONLY group events
  const q2 = query(colRef, where("district", "==", district));

  const snap2 = await getDocs(q2);
  const crossGroupCounts: Record<string, number> = {};

  snap2.forEach((doc) => {
    const d = doc.data();
    const ev = d.groupEvent;

    if (!ev || ev.trim() === "") return;
    crossGroupCounts[ev] = (crossGroupCounts[ev] || 0) + 1;
  });

  console.log("Fetched event map for", district, group, {
    ...individualEventMap,
    ...crossGroupCounts,
  });

  return {
    ...individualEventMap,
    ...crossGroupCounts,
  };
}

export function checkSameEvents(district: string, group: string) {
  return useQuery({
    queryKey: ["eventMap", district, group],
    queryFn: () => fetchEventsMap(district, group),
    enabled: !!district && !!group, // only fetch when both exist
    refetchOnMount: "always", // always refetch when rendered
    refetchOnWindowFocus: false,
    staleTime: 0, // ensure refetch on every change
  });
}
