import { Link } from "react-router-dom";
import { Link as MUILink } from "@mui/material";
import Auth from "./Auth";
import { useCreateUser } from "../../hooks/useCreateUser";
import { useState } from "react";
import { extracErrorMessage } from "../../utils/errors";
import { useLogin } from "../../hooks/useLogin";

const Signup = () => {
  const [createUser] = useCreateUser();
  const [error, setError] = useState('');
  const {login} = useLogin();

  return (
    <Auth
      submitLabel="Signup"
      error={error}
      onSubmit={async ({ email, password }) => {
        // console.log("1. Bắt đầu Signup với data:", { email, password }); // <-- LOG 1
        try {
            const result = await createUser({
            variables: {
                createUserInput: { email, password },
            },
            });

            // console.log("2. Kết quả từ Server:", result); // <-- LOG 2
            await login({email, password});
            setError("");

        } catch (error) {
            // Log chi tiết lỗi từ Apollo/Network
            // console.error("3. Lỗi Signup chi tiết:", JSON.stringify(error, null, 2)); 
            console.error("4. Message lỗi:", error instanceof Error ? error.message : String(error));
            const errorMessage = extracErrorMessage(error);
            if (errorMessage) {
              setError(errorMessage)
            }
     
          }
        }}
    >
      {/* Chỉ có UI/JSX mới được nằm ở đây (children) */}
      <Link to={"/login"} style={{ alignSelf: 'center', marginTop: '1rem', display: 'block' }}>
        <MUILink component="span">Already have an account? Login</MUILink>
      </Link>
    </Auth>
  );
};

export default Signup;