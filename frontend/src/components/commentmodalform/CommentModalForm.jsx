import { useState } from "react";
import Button from "../Button/Button";
import Input from "../input/Input";
import Modal from "../modal/Modal";
import RateStar from "../ratestar/RateStar";
import formApiHandler from "../../api/form";
import Loading from "../icons/Loading";

const CommentModalForm = ({ commentModalActive, setCommentModalActive, setToastList, setErrors, product }) => {
  const [commentStarsRate, setCommentStartRate] = useState(5);
  const [loading, setLoading] = useState(false);
  const changeCommentRateHandler = (rate) => setCommentStartRate(rate);
  const commentFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await formApiHandler(
      `comment/product/${product?.id}/save`,
      { content: e.target.content.value, rate: commentStarsRate },
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
      className="md:h-[300px] h-100 md:w-[460px] w-100 p-6 rounded-3xl bg-[var(--color-productcolor)] border border-[var(--border-color)]"
    >
      <form onSubmit={commentFormSubmit} className="flex flex-col md:gap-y-4 gap-y-8 ">
        <h3 className="text-lg font-semibold text-[var(--color-white)]">ثبت دیدگاه</h3>
        <div className="flex items-center gap-x-2">
          <label className="text-sm text-[var(--sub-text-color)]">امتیاز ثبت شده</label>
          <div className="flex gap-x-1 text-[var(--color-yellow)]">
            <RateStar currentRate={commentStarsRate} starRate={1} onClick={() => changeCommentRateHandler(1)} />
            <RateStar currentRate={commentStarsRate} starRate={2} onClick={() => changeCommentRateHandler(2)} />
            <RateStar currentRate={commentStarsRate} starRate={3} onClick={() => changeCommentRateHandler(3)} />
            <RateStar currentRate={commentStarsRate} starRate={4} onClick={() => changeCommentRateHandler(4)} />
            <RateStar currentRate={commentStarsRate} starRate={5} onClick={() => changeCommentRateHandler(5)} />
          </div>
        </div>
        <div>
          <label className="text-sm text-[var(--sub-text-color)]">متن دیدگاه</label>
          <Input
            name="content"
            type="textarea"
            inputclassName="bg-[var(--tp-b-color)] border border-[var(--border-color)] text-[var(--color-white)] rounded-xl focus:ring-2 focus:ring-[var(--bf-orange)]/40"
          />
        </div>
        <Button size="lg" bgColor="bg-[var(--bf-red)]" txtColor="text-white" shape="rounded-xl">
          {loading ? <Loading className="w-6 h-6"></Loading> : "ثبت دیدگاه"}
        </Button>
      </form>
    </Modal>
  );
};
export default CommentModalForm;