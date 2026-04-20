import { useLocation, useParams } from "react-router-dom";
import { useGetChat } from "../../hooks/useGetChat";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  InputBase,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useCreateMessage } from "../../hooks/useCreateMessage";
import { useEffect, useRef, useState } from "react";
import { useGetMessages } from "../../hooks/useGetMessages";
import { useMessageCreated } from "../../hooks/useMessageCreated";

const Chat = () => {
  const params = useParams();
  const [message, setMessage] = useState("");
  const chatId = params._id!;
  
  const { data } = useGetChat({ _id: chatId });
  const { data: messages } = useGetMessages({ chatId });
  
  // Sửa lỗi TS2554: Truyền object rỗng nếu hook yêu cầu 1 đối số
  const [createMessage] = useCreateMessage(chatId);

  const divRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();

  useMessageCreated({ chatId });

  const scrollToBottom = () => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessage("");
    scrollToBottom();
  }, [location.pathname, messages]);

  const handleCreateMessage = async () => {
    if (!message.trim()) return;
    
    await createMessage({
      variables: { createMessageInput: { content: message, chatId } },
    });
    setMessage("");
  };

  return (
    <Stack sx={{ height: "100%", justifyContent: "space-between" }}>
      <h1>{data?.chat.name}</h1>
      
      <Box sx={{ maxHeight: "70vh", overflow: "auto", flexGrow: 1, mb: 2 }}>
        {messages &&
          [...messages.messages]
            .sort(
              (messageA, messageB) =>
                new Date(messageA.createdAt).getTime() -
                new Date(messageB.createdAt).getTime()
            )
            .map((message) => (
              <Grid 
                container 
                key={message._id} 
                sx={{ 
                  marginBottom: "1rem", 
                  alignItems: "center" // Đưa vào sx để tránh lỗi Overload của Grid2
                }}
              >
                <Grid size={{ xs: 2, lg: 1 }}>
                  <Avatar src="" sx={{ width: 52, height: 52 }} />
                </Grid>
                <Grid size={{ xs: 10, lg: 11 }}>
                  <Stack>
                    <Paper sx={{ width: "fit-content", bgcolor: "background.paper" }}>
                      <Typography sx={{ padding: "0.9rem" }}>
                        {message.content}
                      </Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      sx={{ marginLeft: "0.25rem", mt: 0.5 }}
                    >
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            ))}
        <div ref={divRef}></div>
      </Box>

      <Paper
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateMessage();
        }}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          mb: 2,
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          onChange={(event) => setMessage(event.target.value)}
          value={message}
          placeholder="Message"
          onKeyDown={async (event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              await handleCreateMessage();
            }
          }}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          onClick={handleCreateMessage}
          color="primary"
          sx={{ p: "10px" }}
        >
          <SendIcon />
        </IconButton>
      </Paper>
    </Stack>
  );
};

export default Chat;