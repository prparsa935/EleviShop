import { useEffect, useRef, useState } from "react";
import Button from "../Button/Button";
import Input from "../input/Input";
import Modal from "../modal/Modal";
import { getFieldMessage } from "../../utils/helperMehods";

const PersonInformaionForm = ({
  setPersonFormModalActive,
  personFormModalActive,
  person,
  errors,
}) => {
  const [formValues, setFormValues] = useState();
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

  return (
    <Modal
      setModalActive={setPersonFormModalActive}
      enable={personFormModalActive}
      className="lg:h-[70vh] h-full lg:w-[550px] w-100 p-6 rounded-2xl "
    >
      <form className="flex-col flex gap-y-4">
        <div className="  font-semibold  border-b pb-5 ">
          <span>تکمیل پروفایل</span>
        </div>
        <div className=" grid md:grid-cols-2 grid-cols-1 gap-x-2">
          <div className="flex flex-col gap-y-2">
            <label className="text-neutral-500 mr-2 font-semibold">نام</label>

            <Input
              name="firstName"
              onChange={updateFormValue}
              value={person?.firstName}
              iMessage={getFieldMessage("firstName", errors)}
            ></Input>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-neutral-500 mr-2 font-semibold">
              نام خانوادگی
            </label>
            <Input
              name="lastName"
              onChange={updateFormValue}
              value={person?.lastName}
              iMessage={getFieldMessage("lastName", errors)}
            ></Input>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-neutral-500 mr-2 font-semibold">
              شماره موبایل
            </label>
            <Input
              name="phoneNumber"
              onChange={updateFormValue}
              value={person?.phoneNumber}
              iMessage={getFieldMessage("phoneNumber", errors)}
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
            value={person?.address?.postalCode}
            iMessage={getFieldMessage("postalCode", errors)}
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
            value={person?.address?.addressLine}
            iMessage={getFieldMessage("addressLine", errors)}
          ></Input>
        </div>
        <Button
          size="lg"
          shape="rounded-xl"
          txtColor="text-rose-500"
          moreCss="border-rose-500"
        >
          ثبت اطلاعات
        </Button>
      </form>
    </Modal>
  );
};
export default PersonInformaionForm;
