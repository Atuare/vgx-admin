import { IUser } from "@/interfaces/user.interface";
import { useSelector } from "react-redux";

const useUser = () => {
  const user: IUser | undefined = useSelector<any>(
    state => state?.userState?.user,
  ) as IUser | undefined;

  return {
    user,
  };
};

export default useUser;
