import { Box, Button } from "@mui/material";
import router from "../Routes";
import { Page } from "../../interfaces/page.interface";

interface NavigationProps {
  pages: Page[];
}

const Navigation = ({ pages }: NavigationProps) => {
  return (
    <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
      {pages.map((page) => (
        <Button 
        key={page.title}
        onClick={() => router.navigate(page.path)}
        sx={{ my: 2, color: "white", display: "block" }}>
          {page.title}
        </Button>
      ))}
    </Box>
  );
};

export default Navigation;