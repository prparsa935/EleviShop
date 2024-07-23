import AddToCart from "../addtocart/AddToCart";
import HorizentalProductList from "../horizentalproductlist/HorizentalProductList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tab/Tab";

const ProductLowerSection = () => {
  return (
    <div className="flex flex-col gap-y-10">
      <div className="flex w-100 ">
        <Tabs
          activationMode={"manual"}
          defaultValue="tab2"
          orientation="vertical"
          className="grow "
        >
          <TabsList
            className={
              "w-100 lg:justify-start justify-around sticky top-[96px] mb-8  "
            }
          >
            <TabsTrigger className={"lg:grow-0 grow"} value="introduction">
              معرفی
            </TabsTrigger>
            <TabsTrigger className={"lg:grow-0 grow"} value="properties">
              مشخصات
            </TabsTrigger>
            <TabsTrigger className={"lg:grow-0 grow"} value="tab3">
              دیدگاه ها
            </TabsTrigger>
          </TabsList>
          <TabsContent data-state="active" value="introduction">
            <div className=" text-neutral-600 text-justify lg:text-base lg:leading-8 text-sm   !leading-6 font-medium mx-5">
              عینک آفتابی همیشه جزو اکسسوری‌هایی بوده که علاوه بر جلوگیری از
              تابش نور مستقیم آفتاب به چشم، جنبه‌ی زیبایی هم دارد. امروزه هر
              کدام از افراد سعی بر این دارند با وارد کردن جزییات جذاب به استایل
              خود فرم متفاوت و جذابی بدهند. فرم فریم این عینک به صورت چندضلعی و
              نامتقارن است و جزو فرم‌های خاص به شمار می‌آید. جنس فریم از
              TPE(الاستومر ترموپلاستیک) تشکیل شده است. جنس لنز نیز پلی آمید است
              و رنگ عدسی عینک مشکی است. مدل فریم این عینک با انواع فرم صورت
              مانند گرد، بیضی، مستطیل، قلبی و غیره مطابقت دارد. عینک آفتابی مدل
              GANG برای آب و هوای آفتابی، استفاده روزمره ، دوچرخه سواری کوهستان،
              شکار، اسکی، کوهنوردی و رانندگی قابل استفاده است. اگر می¬خواهید یک
              عینک آفتابی خاص و متفاوت داشته باشید عینک آفتابی مدل GANG برای شما
              کاملا مناسب است.
            </div>
          </TabsContent>
          <TabsContent data-state="active" value="properties">
            <div className="flex lg:gap-x-72 lg:flex-row flex-col mx-10 ">
              <div className=" lg:text-xl text-base font-medium text-neutral-700 mb-5">
                مشخصات
              </div>
              <div className="flex flex-col gap-y-8 ">
                <div className="flex lg:text-base text-xs ">
                  <span className=" text-neutral-400 font-semibold ml-36  ">
                    جنس فریم
                  </span>
                  <span>TPE (الاستومر ترموپلاستیک)</span>
                </div>
                <div className="flex  lg:text-base text-xs ">
                  <span className=" text-neutral-400 font-semibold  ml-36 ">
                    فرم فریم
                  </span>
                  <span>چند ضلعی فریم های خاص مربعی مستطیلی</span>
                </div>
                <div className="flex  lg:text-base text-xs">
                  <span className=" text-neutral-400 font-semibold ml-36 ">
                    جنس فریم
                  </span>
                  <span>TPE (الاستومر ترموپلاستیک)</span>
                </div>
                <div className="flex lg:text-base text-xs">
                  <span className=" text-neutral-400 font-semibold ml-36  ">
                    جنس فریم
                  </span>
                  <span>TPE (الاستومر ترموپلاستیک)</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent data-state="active" value="tab3">
            Tab three content
          </TabsContent>
        </Tabs>
        <div>
          <div className="w-[333px] xl:block hidden mr-10">
            <AddToCart></AddToCart>
          </div>
        </div>
      </div>
      <HorizentalProductList></HorizentalProductList>
    </div>
  );
};
export default ProductLowerSection;
