import { useNavigate } from "react-router";
import Button from "../components/Button/Button";
import Input from "../components/input/Input";
import Separator from "../components/separator/Separator";
import AuthContext from "../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import Alert from "../components/alert/Alert";
const Register = () => {
  const { register, user } = useContext(AuthContext);
  const [errors, setErrors] = useState([]);
  const [toastList, setToastList] = useState([]);
  const navigate = useNavigate();
  const registerSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    const username = form.get("username");
    const password = form.get("password");
    const confirmPassword = form.get("confirmPassword");

    const email = form.get("email");
    register(
      email,
      username,
      password,
      confirmPassword,
      setErrors,
      setToastList
    );
  };
  useEffect(() => {
    if (user !== null) {
      return navigate("/");
    }
  }, [user]);

  return (
    <div className="login-page flex items-center justify-center h-screen">
      <div className=" absolute top-0 w-100">
        {toastList?.map((toast) => {
          return (
            <Alert duration={5000} type={toast.type}>
              {toast.message}
            </Alert>
          );
        })}
      </div>
      <div className="w-full lg:w-[400px]  lg:border rounded-2xl  p-8 flex flex-col">
        {/* header */}
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="135"
            height="50"
            viewBox="0 0 115 30"
          >
            <g fill="none" fill-rule="evenodd">
              <g fill="#EE384E">
                <g>
                  <g>
                    <path
                      d="M76.916 19.024h6.72v-8.78h-6.72c-1.16 0-2.24 1.061-2.24 2.195v4.39c0 1.134 1.08 2.195 2.24 2.195zm26.883 0h6.72v-8.78h-6.72c-1.16 0-2.24 1.061-2.24 2.195v4.39c0 1.134 1.08 2.195 2.24 2.195zM88.117 6.951v15.366c0 .484-.625 1.098-1.12 1.098l-2.24.023c-.496 0-1.12-.637-1.12-1.12v-.733l-1.017 1.196c-.31.413-1.074.634-1.597.634h-4.107c-3.604 0-6.721-3.063-6.721-6.586v-4.39c0-3.523 3.117-6.585 6.72-6.585h10.082c.495 0 1.12.613 1.12 1.097zm26.883 0v15.366c0 .484-.624 1.098-1.12 1.098l-2.24.023c-.496 0-1.12-.637-1.12-1.12v-.733l-1.017 1.196c-.31.413-1.074.634-1.597.634h-4.107c-3.604 0-6.721-3.063-6.721-6.586v-4.39c0-3.523 3.117-6.585 6.72-6.585h10.082c.495 0 1.12.613 1.12 1.097zm-74.675 3.293h-6.721c-1.16 0-2.24 1.061-2.24 2.195v4.39c0 1.134 1.08 2.195 2.24 2.195h6.72v-8.78zm4.48-3.293V23.78c0 3.523-3.117 6.22-6.72 6.22H34.62c-.515 0-1-.236-1.311-.638l-1.972-2.55c-.327-.424-.144-1.202.399-1.202h6.347c1.16 0 2.24-.696 2.24-1.83v-.365h-6.72c-3.604 0-6.72-3.063-6.72-6.586v-4.39c0-3.523 3.116-6.585 6.72-6.585h4.107c.514 0 1.074.405 1.437.731l1.177 1.098V6.95c0-.483.625-1.097 1.12-1.097h2.24c.496 0 1.12.613 1.12 1.097zM4.481 16.83c0 1.134 1.08 2.195 2.24 2.195h6.72v-8.78h-6.72c-1.16 0-2.24 1.061-2.24 2.195v4.39zM16.8 0c.497 0 1.121.613 1.121 1.098v21.22c0 .483-.624 1.097-1.12 1.097h-2.24c-.496 0-1.12-.613-1.12-1.098v-.732l-1.175 1.232c-.318.346-.932.598-1.44.598H6.722C3.117 23.415 0 20.352 0 16.829v-4.356c0-3.523 3.117-6.62 6.72-6.62h6.722V1.099c0-.485.624-1.098 1.12-1.098h2.24zm46.3 14.634L69.336 6.9c.347-.421.04-1.048-.513-1.048h-3.566c-.27 0-.525.119-.696.323l-6.314 7.727V1.098c0-.485-.625-1.098-1.12-1.098h-2.24c-.496 0-1.12.613-1.12 1.098v21.22c0 .483.624 1.097 1.12 1.097h2.24c.495 0 1.12-.614 1.12-1.098v-6.951l6.317 7.744c.17.207.428.328.7.328h3.562c.554 0 .86-.627.514-1.048l-6.24-7.756zM48.166 0c-.496 0-1.12.613-1.12 1.098v2.195c0 .484.624 1.097 1.12 1.097h2.24c.495 0 1.12-.613 1.12-1.097V1.098c0-.485-.625-1.098-1.12-1.098h-2.24zm0 5.854c-.496 0-1.12.613-1.12 1.097v15.366c0 .484.8 1.12 1.295 1.12l2.065-.022c.495 0 1.12-.614 1.12-1.098V6.951c0-.484-.625-1.097-1.12-1.097h-2.24zM21.282 0c-.495 0-1.12.613-1.12 1.098v2.195c0 .484.625 1.097 1.12 1.097h2.24c.496 0 1.12-.613 1.12-1.097V1.098c0-.485-.624-1.098-1.12-1.098h-2.24zm0 5.854c-.495 0-1.12.613-1.12 1.097v15.366c0 .484.625 1.098 1.12 1.098h2.24c.496 0 1.12-.614 1.12-1.098V6.951c0-.484-.624-1.097-1.12-1.097h-2.24zm73.556-4.756v21.22c0 .483-.625 1.097-1.12 1.097h-2.24c-.496 0-1.12-.614-1.12-1.098V1.097c0-.484.624-1.097 1.12-1.097h2.24c.495 0 1.12.613 1.12 1.098z"
                      transform="translate(-1235 -19) translate(-238) translate(1473 19)"
                    />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </div>
        {/* body */}
        <form onSubmit={registerSubmit} className="flex flex-col">
          <div className=" font-semibold text-slate-700 text-2xl flex items-center gap-x-2 mt-5">
            <span>ثبت نام</span>
          </div>
          <div className=" text-sm text-slate-600 mt-5 flex flex-col gap-y-1">
            <span>سلام لطفا اطلاعات خود را وارد کنید!</span>
          </div>

          <div className=" text-sm text-slate-600 mt-1 flex flex-col gap-y-1">
            <span>ایمیل</span>
          </div>
          <div className="mt-2">
            <Input iMessage={errors?.email} name="email"></Input>
          </div>
          <div className=" text-sm text-slate-600 mt-1 flex flex-col gap-y-1">
            <span>نام کاربری</span>
          </div>
          <div className="mt-2">
            <Input iMessage={errors?.username} name="username"></Input>
          </div>
          <div className=" text-sm text-slate-600 mt-1 flex flex-col gap-y-1">
            <span>رمز عبور</span>
          </div>
          <div className="mt-2">
            <Input
              iMessage={errors?.password}
              name="password"
              type="password"
            ></Input>
          </div>
          <div className=" text-sm text-slate-600 mt-1 flex flex-col gap-y-1">
            <span>تکرار رمز عبور </span>
          </div>
          <div className="mt-2">
            <Input
              iMessage={errors?.confirmPassword}
              name="confirmPassword"
              type="password"
            ></Input>
          </div>
          <div className="mt-7">
            <Button
              bgColor="bg-rose-500"
              txtColor="text-white"
              moreCss="w-full"
              shape="rounded-lg"
            >
              ثبت نام
            </Button>
          </div>
          <div className="flex flex-col font-semibold text-sm mt-3 text-red-500">
            {errors?.map((error) => {
              return <span>{toastList.message}</span>;
            })}
          </div>

          <div className="text-xs mt-6 flex justify-center text-slate-500">
            ورود شما به معنای پذیرش شرایط دیجی‌کالاو قوانین حریم‌خصوصی است
          </div>
          <div className="text-sm mt-6 flex justify-center text-slate-500">
            <span>جهت ورود</span>
            <span
              className=" text-sky-500 mx-1 cursor-pointer "
              onClick={() => navigate("/login")}
            >
              اینجا
            </span>
            <span>کلیک کنید</span>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Register;
