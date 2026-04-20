import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Branding from "./Branding";
import Navigation from "./Navigation";
import MobileNavigation from "./mobile/MobileNavigation";
import MobileBranding from "./mobile/MobileBranding";
import Settings from "./Settings";
import { useReactiveVar } from "@apollo/client/react";
import { authenticatedVar } from "../../constants/authenticated";
import { Page } from "../../interfaces/page.interface";


const pages: Page[] = [
    {
        title: "Home",
        path: "/"
    },
]

const unauthenticatedPages: Page[] = [
        {
            title: "Login",
            path: "/login"
        },
        {
            title: "Signup",
            path: "/signup"
        }
    ]

const Header = () => {
  const authenticated = useReactiveVar(authenticatedVar);

  // Define which links to show based on auth state
  const activePages = authenticated ? pages : unauthenticatedPages;

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Branding />
          {/* Use activePages for both Mobile and Desktop */}
          <MobileNavigation pages={activePages} />
          <MobileBranding />
          <Navigation pages={activePages} />
          
          {authenticated && <Settings />}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;