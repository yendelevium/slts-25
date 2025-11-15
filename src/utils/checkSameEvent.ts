import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import { useQuery } from "@tanstack/react-query";

// Fetch events map for a given district and group -> for fast look-ups to see already taken events :)
export async function fetchEventsMap(district: string, group: string) {
  const colRef = collection(db, "register");

  const q = query(
    colRef,
    where("district", "==", district),
    where("group", "==", group),
  );

  const snap = await getDocs(q);
  const map: Record<string, true> = {};
  snap.forEach((doc) => {
    const d = doc.data();
    const add = (v?: string) => {
      if (v && v.trim() !== "") {
        map[v] = true;
      }
    };

    add(d.groupEvent);
    add(d.individualChoice1);
    add(d.individualChoice2);
  });

  return map;
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
