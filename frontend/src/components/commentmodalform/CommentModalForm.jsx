import { useState } from "react";
import Button from "../Button/Button";
import Input from "../input/Input";
import Modal from "../modal/Modal";
import RateStar from "../ratestar/RateStar";
import formApiHandler from "../../api/form";
import Loading from "../icons/Loading";

const CommentModalForm = ({
  commentModalActive,
  setCommentModalActive,
  setToastList,
  setErrors,
  product,
}) => {
  const [commentStarsRate, setCommentStartRate] = useState(5);
  const [loading, setLoading] = useState(false);
  const changeCommentRateHandler = (rate) => {
    setCommentStartRate(rate);
  };
  const commentFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await formApiHandler(
      `comment/product/${product?.id}/save`,
      {
        content: e.target.content.value,
        rate: commentStarsRate,
      },
      setToastList,
      setErrors,
      setLoading
    );
    setCommentModalActive(false);
  };

  return (
    <Modal
      enable={commentModalActive}
      setModalActive={setCommentModalActive}
      className=" md:h-[300px] h-100 md:w-[460px] w-100  p-5 rounded-xl"
    >
      <form
        onSubmit={commentFormSubmit}
        className="flex flex-col md:gap-y-4 gap-y-8 "
      >
        <h3 className=" text-lg text-slate-800">ثبت دیدگاه</h3>
        <div className="flex gap-x-2">
          <label className=" text-sm">امتیاز ثبت شده</label>
          <RateStar
            currentRate={commentStarsRate}
            starRate={1}
            onClick={() => changeCommentRateHandler(1)}
          />
          <RateStar
            currentRate={commentStarsRate}
            starRate={2}
            onClick={() => changeCommentRateHandler(2)}
          />
          <RateStar
            currentRate={commentStarsRate}
            starRate={3}
            onClick={() => changeCommentRateHandler(3)}
          />
          <RateStar
            currentRate={commentStarsRate}
            starRate={4}
            onClick={() => changeCommentRateHandler(4)}
          />
          <RateStar
            currentRate={commentStarsRate}
            starRate={5}
            onClick={() => changeCommentRateHandler(5)}
          />
        </div>
        <div>
          <label>متن دیدگاه</label>
          <Input name="content" type="textarea" />
        </div>
        <Button size="lg" bgColor="bg-rose-500" txtColor="text-white">
          {loading ? <Loading className="w-6 h-6"></Loading> : "ثبت کالا"}
        </Button>
      </form>
    </Modal>
  );
};
export default CommentModalForm;
