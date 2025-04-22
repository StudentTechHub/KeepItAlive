export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "KeepItAlive",
  description:
    "KeepItAlive is a modern collaborative platform designed to boost productivity by connecting teams, managing projects, and providing streamlined access to key tools and features.",
  navItems: [
    {
      label: "Home",
      href: "/"
    },
    {
      label: "About",
      href: "/about"
    }
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile"
    },
    {
      label: "Dashboard",
      href: "/dashboard"
    },
    {
      label: "Projects",
      href: "/projects"
    },
    {
      label: "Team",
      href: "/team"
    },
    {
      label: "Calendar",
      href: "/calendar"
    },
    {
      label: "Settings",
      href: "/settings"
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback"
    },
    {
      label: "Logout",
      href: "/logout"
    }
  ],

  authLinks: [
    {
      label: "Login",
      href: "/login"
    },
    {
      label: "Register",
      href: "/register"
    },
    {
      label: "Forgot Password",
      href: "/forgot-password"
    }
  ],

  links: {
    github: "https://github.com/StudentTechHub/KeepItAlive"
  }
};
