import { JSX, useEffect } from "react";
import { useGetMe } from "../../hooks/useGetMe";
import excludedRoutes from "../../constants/excluded-routes";
import { authenticatedVar } from "../../constants/authenticated";
import { usePath } from "../../hooks/usePath";

interface GuardProps {
  children: JSX.Element;
}

const Guard = ({ children }: GuardProps) => {
  // 1. Bạn đã đặt tên alias là 'user' ở đây
  const { data: user, loading } = useGetMe(); 
  const {path} = usePath();

  useEffect(() => {
    if (user) {
      authenticatedVar(true);
    }
  }, [user]);

  if (loading) {
    return null; // Hoặc một cái Loading Spinner
  }

  const isExcluded = excludedRoutes.includes(window.location.pathname);

  return (
    <>
      {isExcluded 
        ? children 
        // 2. Sửa 'data?.me' thành 'user?.me' để khớp với biến đã khai báo ở trên
        : (user?.me && children) 
      }
    </>
  );
};

export default Guard;