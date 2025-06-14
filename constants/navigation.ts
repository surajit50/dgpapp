export type MenuItem = {
  name: string;
  title: string;
  icon: string;
  roles: string[];
};

export const MENU_ITEMS: MenuItem[] = [
  {
    name: "index",
    title: "Dashboard",
    icon: "home",
    roles: ["admin", "staff", "user"],
  },
  {
    name: "users",
    title: "Users",
    icon: "users",
    roles: ["admin"],
  },
  {
    name: "reports",
    title: "Reports",
    icon: "bar-chart",
    roles: ["admin", "staff"],
  },
  {
    name: "profile",
    title: "Profile",
    icon: "user",
    roles: ["admin", "staff", "user"],
  },
];
