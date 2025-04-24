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
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback"
    }
  ],
  navMenuItems: [
    {
      label: "Help & Feedback",
      href: "/help-feedback"
    },
    {
      label: "Home",
      href: "/"
    },
    {
      label: "About",
      href: "/about"
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback"
    }
  ],

  authLinks: [
    {
      label: "Login",
      href: "/login"
    },
    {
      label: "Signup",
      href: "/signup"
    },
    {
      label: "Reset Password",
      href: "/reset-password"
    }
  ],

  links: {
    github: "https://github.com/StudentTechHub/KeepItAlive"
  }
};
