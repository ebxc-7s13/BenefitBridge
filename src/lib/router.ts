import { useEffect, useState } from "react";

/** Hash routes keep the app working from a single file, a subfolder, or offline. */
export type Route =
  | { name: "home" }
  | { name: "country" }
  | { name: "screener"; step: number }
  | { name: "results" }
  | { name: "program"; id: string }
  | { name: "plan" }
  | { name: "help" }
  | { name: "world"; code?: string };

export function parse(hash: string): Route {
  const [, a, b] = hash.replace(/^#/, "").split("/");
  switch (a) {
    case "screener":
      return { name: "screener", step: Math.max(1, Number(b) || 1) };
    case "results":
      return { name: "results" };
    case "program":
      return b ? { name: "program", id: decodeURIComponent(b) } : { name: "results" };
    case "plan":
      return { name: "plan" };
    case "country":
      return { name: "country" };
    case "help":
      return { name: "help" };
    case "world":
      return b ? { name: "world", code: decodeURIComponent(b).toUpperCase() } : { name: "world" };
    default:
      return { name: "home" };
  }
}

export function href(route: Route): string {
  switch (route.name) {
    case "home":
      return "#/";
    case "screener":
      return `#/screener/${route.step}`;
    case "program":
      return `#/program/${encodeURIComponent(route.id)}`;
    case "world":
      return route.code ? `#/world/${route.code}` : "#/world";
    default:
      return `#/${route.name}`;
  }
}

export function go(route: Route): void {
  window.location.hash = href(route);
}

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parse(window.location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parse(window.location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
