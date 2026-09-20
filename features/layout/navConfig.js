export const NAV_ITEMS = [
  { key: "home", href: "/" },
  {
    key: "about",
    children: [
      { key: "aboutIntro", href: "/about/intro" },
      { key: "aboutMembers", href: "/about/members" },
      { key: "aboutSocial", href: "/about/social" },
      { key: "aboutNews", href: "/about/news" },
    ],
  },
  {
    key: "teams",
    children: [
      { key: "teamsAmbience", href: "/teams/ambience" },
      { key: "teamsHistory", href: "/teams/history" },
      { key: "teamsDepartment", href: "/teams/department" },
    ],
  },
  { key: "projects", href: "/projects" },
  { key: "guestbook", href: "/guestbook" },
  { key: "sponsorship", href: "/sponsorship" },
];
