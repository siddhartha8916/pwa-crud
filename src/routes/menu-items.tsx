export type NavLinkProps = {
  title: string;
  icon: React.ReactElement;
  link: string;
  subMenus?: NavLinkProps[];
};
// eslint-disable-next-line react-refresh/only-export-components
export const MenuItems: NavLinkProps[] = [
  {
    title: "Survey",
    icon: <></>,
    link: "/survey",
    subMenus: [],
  },
  {
    title: "Dynamic Survey",
    icon: <></>,
    link: "/dynamic-survey",
  },
  {
    title: "Users",
    icon: <></>,
    link: "/users",
  },
  {
    title: "Register",
    icon: <></>,
    link: "/register",
  },
  {
    title: "Login",
    icon: <></>,
    link: "/login",
  },
  {
    title: "Gallery-Two",
    icon: <></>,
    link: "/gallery-two",
  },
];
