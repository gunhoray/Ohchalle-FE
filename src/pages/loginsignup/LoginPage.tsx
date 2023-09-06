import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCheck } from "../../api/AuthApi";
import {
  Buttons,
  LoginSignupInputsContainers,
  Nav,
  SNSLoginContainer,
  Etc,
} from "./Common.style";
import { useMutation } from "@tanstack/react-query";
import { LoginPageBlock } from "./LoginPage.style";
import SNSlogin from "../../components/loginsignup/SNSlogin";
import useUserValidation from "./useUserVaildation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/config/ConfigStore";
import { setLoggedInStatus } from "../../redux/modules/Modules";

interface User {
  useremail: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const redirectItemId = useSelector(
    (state: RootState) => state.direction.itemId
  );
  const redirectUrlId = useSelector(
    (state: RootState) => state.direction.redirectUrl
  );
  const redirectSocialItemId = useSelector(
    (state: RootState) => state.direction.socialItemId
  );
  const dispatch = useDispatch();

  const mutation = useMutation(UserCheck, {
    onSuccess: () => {
      if (redirectItemId !== null) {
        dispatch(setLoggedInStatus(true));
        navigate(`/crew/${redirectItemId}`);
      } else if (redirectSocialItemId !== "") {
        dispatch(setLoggedInStatus(true));
        navigate(`/socialPost/${redirectSocialItemId}`);
      } else if (redirectUrlId !== null) {
        dispatch(setLoggedInStatus(true));
        navigate(`${redirectUrlId}`);
      } else {
        dispatch(setLoggedInStatus(true));
        navigate("/");
      }
    },
    onError: () => {
      alert("입력하신 정보가 맞지 않습니다. 다시 시도해주세요.");
      setUser({ useremail: "", password: "" });
      navigate("/login");
    },
  });

  // const useremailRef = useRef<HTMLInputElement | null>(null);
  // const passwordRef = useRef<HTMLInputElement | null>(null);
  const [user, setUser] = useState<User>({
    useremail: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log("user", user);
  };
  const { useremailRef, passwordRef, checkAllValidations } =
    useUserValidation(user);
  // console.log(useremailRef, passwordRef, checkAllValidations);
  const userCheck = () => {
    if (checkAllValidations()) {
      mutation.mutate(user);
    } else {
      return;
    }
  };

  return (
    <LoginPageBlock>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit}>
        <LoginSignupInputsContainers>
          <input
            ref={useremailRef}
            name="useremail"
            value={user.useremail}
            type="email"
            placeholder="이메일"
            onChange={handleChange}
          />
          <input
            ref={passwordRef}
            name="password"
            value={user.password}
            type="password"
            placeholder="비밀번호"
            onChange={handleChange}
          />

          <Buttons onClick={userCheck} type="submit">
            로그인
          </Buttons>
        </LoginSignupInputsContainers>
      </form>
      <SNSLoginContainer>
        <span>SNS계정으로 간편하게 로그인/회원가입</span>
        <SNSlogin />
        <p
          style={{ display: "flex", flexDirection: "column", fontSize: "10px" }}
        >
          카카오와의 서비스 연동을 원하신다면, 동의사항은 꼭 "전체동의"로
          해주시기 바랍니다. 이용에 불편함을 드려 죄송합니다.
        </p>
      </SNSLoginContainer>
      <hr
        style={{
          border: "none",
          borderTop: "1px solid lightgray",
          marginRight: "20px",
          marginLeft: "20px",
        }}
      ></hr>
      <Etc>
        <Nav to="/register">회원가입</Nav>
      </Etc>
    </LoginPageBlock>
  );
};

export default LoginPage;
