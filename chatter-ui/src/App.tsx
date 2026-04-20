import { Container, createTheme, CssBaseline, ThemeProvider, Grid } from "@mui/material";
import { ApolloProvider } from "@apollo/client/react";
import { RouterProvider } from "react-router";
import router from "./components/Routes";
import client from "./constants/apollo-client";
import Guard from "./components/auth/Guard";
import Header from "./components/header/Header";
import Snackbar from "./components/snackbar/Snackbar";
import ChatList from "./components/chat-list/ChatList";
import { usePath } from "./hooks/usePath";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  }
});
 
function App() {
  const { path } = usePath();

  const showChatList = path === '/' || path.includes("chats")

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        
        <Guard>
          {showChatList ? (
            <Container maxWidth="xl" sx={{ mt: 2 }}>
              {/* Sử dụng Grid2 (được đặt tên alias là Grid) để fix lỗi TypeScript */}
              <Grid container spacing={5}>
                
                {/* Sidebar chiếm 3 phần trên desktop */}
                <Grid size={{ xs: 12, md: 3, lg: 4, xl: 3 }}>
                  <ChatList />
                </Grid>

                {/* Nội dung chính chiếm 9 phần */}
                <Grid size={{ xs: 12, md: 7, lg: 8, xl: 9 }}>
                   <Content />
                </Grid>
                
              </Grid>
            </Container>
          ) : (
            <Content />
          )}
        </Guard>

        <Snackbar />
      </ThemeProvider>
    </ApolloProvider>
  );
}

// Tách phần Router ra để tránh lặp lại code và lỗi render
const Content = () => {
  return (
    <Container sx={{ mt: 2 }}>
      <RouterProvider router={router} />
    </Container>
  );
}

export default App;