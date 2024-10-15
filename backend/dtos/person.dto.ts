import { Matches } from "class-validator";

export class PersonSaveDto {
  @Matches(RegExp("^[A-Za-zآ-ی ]{3,20}$"), {
    message: "لطفا نام خانوادگی را درست وارد کنید",
  })
  firstName: string;
  @Matches(RegExp("^[A-Za-zآ-ی ]{3,20}$"), {
    message: "لطفا نام خانوادگی را درست وارد کنید",
  })
  lastName: string;
  @Matches(RegExp("^09\\d{9}$"), {
    message: "لطفا شماره همراه را درست وارد کنید",
  })
  phoneNumber: string;
  @Matches(RegExp("^[0-9]{10}$"), {
    message: "کد پستی نادرست است",
  })
  postalCode: string;

  @Matches(RegExp("^[0-9-A-Za-zآ-ی ]{10,50}$"), { message: "آدرس نادرست است." })
  addressLine: string;
}
