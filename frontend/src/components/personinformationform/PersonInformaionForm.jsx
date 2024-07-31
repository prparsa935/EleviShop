import Button from "../Button/Button";
import Input from "../input/Input";
import Modal from "../modal/Modal";

const PersonInformaionForm = ({
  setPersonFormModalActive,
  personFormModalActive,
  person,
}) => {
  return (
    <Modal
      setPersonFormModalActive={setPersonFormModalActive}
      enable={personFormModalActive}
      className="lg:h-[70vh] h-full lg:w-[550px] w-100 p-6 rounded-2xl "
    >
      <div className="flex-col flex gap-y-4">
        <div className="  font-semibold  border-b pb-5 ">
          <span>تکمیل پروفایل</span>
        </div>
        <div className=" grid md:grid-cols-2 grid-cols-1 gap-x-2">
          <div className="flex flex-col gap-y-2">
            <label className="text-neutral-500 mr-2 font-semibold">نام</label>

            <Input name='firstName' defaultValue={person?.firstName}></Input>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-neutral-500 mr-2 font-semibold">
              نام خانوادگی
            </label>
            <Input name='lastName' defaultValue={person?.lastName}></Input>
          </div>
          <div className="flex flex-col gap-y-2">
            <label className="text-neutral-500 mr-2 font-semibold">
              شماره موبایل
            </label>
            <Input name='phoneNumber' defaultValue={person?.phoneNumber}></Input>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <label className=" text-neutral-500 mr-2 font-semibold">
            کد پستی
          </label>
          <Input name='postalCode' defaultValue={person?.address?.postalCode}></Input>
        </div>
        <div className="flex flex-col gap-y-2">
          <label className=" text-neutral-500 mr-2 font-semibold">
            نشانی پستی
          </label>
          <Input name="addressLine" type="textarea" defaultValue={person?.address?.addressLine}></Input>
        </div>
        <Button
          size="lg"
          shape="rounded-xl"
          txtColor="text-rose-500"
          moreCss="border-rose-500"
        >
          ثبت اطلاعات
        </Button>
      </div>
    </Modal>
  );
};
export default PersonInformaionForm;
