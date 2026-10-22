const paths = {
  food: "M7 3v8a2 2 0 0 0 2 2v8M11 3v6M3 3v6a4 4 0 0 0 4 4M17 21V3c2.5 0 4 3 4 7h-4",
  health: "M12 21s-7-4.5-9-9.5C1.6 7.6 4 4 7.5 4c2 0 3.5 1.2 4.5 2.6C13 5.2 14.5 4 16.5 4 20 4 22.4 7.6 21 11.5 19 16.5 12 21 12 21zM12 9v6M9 12h6",
  money: "M3 7h18v10H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 10v4M18 10v4",
  home: "M3 11 12 4l9 7M5 10v10h14V10M10 20v-6h4v6",
  family: "M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 10a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM2 21v-3a6 6 0 0 1 12 0v3M14 21v-2a4 4 0 0 1 8 0v2",
  check: "M5 12.5 10 17l9-10",
  phone: "M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z",
  external: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  calendar: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4",
  print: "M6 9V3h12v6M6 17H4v-7h16v7h-2M7 14h10v7H7z",
  exit: "M14 4h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-5M10 16l-4-4 4-4M6 12h10",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3z",
  back: "M15 5l-7 7 7 7",
  forward: "M9 5l7 7-7 7",
  list: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01",
  help: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17h.01",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
  shield: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  work: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  farm: "M12 21v-9M12 12C12 8 9 5.5 5 5.5c0 4 3 6.5 7 6.5zM12 12c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5zM6 21h12",
  security: "M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6zM9 12l2 2 4-4",
  id: "M3 6h18v12H3zM8 13a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 16c.5-1.5 1.6-2 3-2s2.5.5 3 2M14 10h4M14 13h3",
  certificate: "M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 15h7M9 18h4",
  bus: "M5 4h14v12H5zM5 11h14M8 19v1M16 19v1M5 16v3h14v-3M8.5 14h.01M15.5 14h.01",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7z",
  scale: "M12 4v17M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0zM12 4l-2-1h4z",
  megaphone: "M3 11v3l11 5V6L3 11zM14 8h3a4 4 0 0 1 0 8h-3M6 15l1 5h3l-1-4",
  map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14",
  plane: "M10 14 3 12l1-2 7 1 4-6h2l-2 7 4 1 1-2h2l-1 4 1 4h-2l-1-2-4 1 2 7h-2l-4-6z",
  store: "M4 9h16l-1-5H5zM5 9v11h14V9M9 20v-6h6v6M4 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0",
  receipt: "M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  sparkle: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 16l.7 1.8L21.5 18.5l-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z",
  speaker: "M4 9h4l5-4v14l-5-4H4zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12",
  stop: "M7 7h10v10H7z",
  share: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
  textSize: "M4 19 9 5l5 14M5.8 14h6.4M15 19l3-8 3 8M15.8 17h4.4",
  bell: "M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21a2 2 0 0 0 4 0",
  education: "M3 9l9-5 9 5-9 5zM7 11v5c3 2 7 2 10 0v-5M21 9v6",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name]} />
    </svg>
  );
}
