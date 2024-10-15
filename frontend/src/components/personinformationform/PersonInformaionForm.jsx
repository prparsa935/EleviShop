import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import Input from "../input/Input";
import Modal from "../modal/Modal";
import formApiHandler from "../../api/form";
import Loading from "../icons/Loading";

const PersonInformaionForm = ({
  setPersonFormModalActive,
  personFormModalActive,
  person,

  setToastList,
}) => {
  const [errors, setErrors] = useState(null);
  const [formValues, setFormValues] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setFormValues(person);
  }, [person]);

  const updateFormValue = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const submitHandler = (e) => {
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const phoneNumber = e.target.phoneNumber.value;
    const postalCode = e.target.postalCode.value;
    const addressLine = e.target.addressLine.value;
    setLoading(true);
    formApiHandler(
      "person/save",
      {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        postalCode: postalCode,
        addressLine: addressLine,
      },
      setToastList,
      setErrors,
      setLoading
    );
    e.preventDefault();
  };

  return (
    <Modal
      setModalActive={setPersonFormModalActive}
      enable={personFormModalActive}
      className="lg:h-[70vh] h-full lg:w-[550px] w-100 p-6 rounded-2xl "
    >
      <form onSubmit={submitHandler} className="flex-col flex gap-y-4">
        <div className="  font-semibold  border-b pb-5 ">
          <span>تکمیل پروفایل</span>
        </div>
        <div className=" grid md:grid-cols-2 grid-cols-1 gap-x-2">
          <div className="flex flex-col gap-y-2">
            <label className="text-neutral-500 mr-2 font-semibold">نام</label>

            <Input
              name="firstName"
              onChange={updateFormValue}
              value={formValues?.firstName}
              iMessage={errors?.firstName}
            ></Input>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-neutral-500 mr-2 font-semibold">
              نام خانوادگی
            </label>
            <Input
              name="lastName"
              onChange={updateFormValue}
              value={formValues?.lastName}
              iMessage={errors?.lastName}
            ></Input>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-neutral-500 mr-2 font-semibold">
              شماره موبایل
            </label>
            <Input
              name="phoneNumber"
              onChange={updateFormValue}
              value={formValues?.phoneNumber}
              iMessage={errors?.phoneNumber}
            ></Input>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <label className=" text-neutral-500 mr-2 font-semibold">
            کد پستی
          </label>
          <Input
            name="postalCode"
            onChange={updateFormValue}
            value={formValues?.postalCode}
            iMessage={errors?.postalCode}
          ></Input>
        </div>
        <div className="flex flex-col gap-y-2">
          <label className=" text-neutral-500 mr-2 font-semibold">
            نشانی پستی
          </label>
          <Input
            name="addressLine"
            type="textarea"
            onChange={updateFormValue}
            value={formValues?.addressLine}
            iMessage={errors?.addressLine}
          ></Input>
        </div>

        <Button
          size="lg"
          moreCss="border-rose-500"
          txtColor="text-rose-500"
          shape="rounded-xl"
          disabled={loading}
        >
          {loading ? <Loading className="w-6 h-6"></Loading> : "ثبت اطلاعات"}
        </Button>
      </form>
    </Modal>
  );
};
export default PersonInformaionForm;
