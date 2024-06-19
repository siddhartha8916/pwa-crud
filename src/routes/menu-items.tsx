export type NavLinkProps = {
  title: string;
  icon: React.ReactElement;
  link: string;
  subMenus?: NavLinkProps[];
};
// eslint-disable-next-line react-refresh/only-export-components
export const MenuItems: NavLinkProps[] = [
  {
    title: "Dashboard",
    icon: <></>,
    link: "/dashboard",
    subMenus: [],
  },
  {
    title: "Users",
    icon: <></>,
    link: "/users",
  },
  {
    title: "Profile",
    icon: <></>,
    link: "/user-profile",
  },
  {
    title: "Gallery-One",
    icon: <></>,
    link: "/gallery-one",
  },
  {
    title: "Gallery-Two",
    icon: <></>,
    link: "/gallery-two",
  },
];
