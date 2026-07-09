import { useEffect, useState } from "react";
import Button from "../Button/Button";
import Tag from "../tag/Tag";
import { findCommentByProductIdPaging } from "../../api/comments";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../icons/Loading";
import { formatRelativeTime } from "../../utils/helperMehods";
import RateStar from "../ratestar/RateStar";

const Comments = ({ setCommentModalActive, product }) => {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [commentOrder, setCommentOrder] = useState(null);
  useEffect(() => {
    console.log(commentOrder);
    findCommentByProductIdPaging(
      product?.id,
      commentOrder,
      [],
      setComments,
      1,
      setPage,
      setHasMore
    );
  }, [commentOrder]);
  useEffect(() => {
    console.log(comments);
  }, [comments]);
  return (
    <div className="flex flex-col">
      <h3 className=" text-lg font-semibold mb-5">امتیاز و دیدگاه کاربران</h3>
      <div className="flex md:flex-row flex-col gap-y-5">
        {/* right section (side section) */}
        <div>
          <div className="md:w-[300px] w-full p-3 flex flex-col gap-y-4 ">
            <div className="flex items-center gap-x-1 ">
              <h3 className="text-lg font-semibold">۴.۲</h3>
              <span className="text-sm"> از</span>
              <span className="text-sm">۵</span>
            </div>
            <div className="flex gap-x-1 text-sm">
              <i className="fa fa-star text-[var(--color-yellow)] " aria-hidden="true"></i>
              <i className="fa fa-star text-[var(--color-yellow)] " aria-hidden="true"></i>
              <i className="fa fa-star text-[var(--color-yellow)] " aria-hidden="true"></i>
              <i className="fa fa-star text-[var(--color-yellow)] " aria-hidden="true"></i>
              <i className="fa fa-star text-[var(--sub-text-color)] " aria-hidden="true"></i>
            </div>
            <span className=" text-sm text-[var(--sub-text-color)] ">
              نظر خود را درباره این ثبت کنید
            </span>
            <Button
              size="sm"
              moreCss="border-[var(--bf-red)]"
              txtColor="text-[var(--bf-red)]"
              onClick={() => setCommentModalActive(true)}
            >
              ثبت دیدگاه
            </Button>
          </div>
        </div>
        {/* left section */}
        <div className="grow flex flex-col text-[var(--sub-text-color)] text-sm gap-y-4">
          <div className="flex justify-between">
            <div className=" flex gap-x-3">
              <span className=" text-[var(--color-white)]  ">مرتب سازی:</span>
              <span
                onClick={() => setCommentOrder("earliest")}
                className={
                  " text-[var(--bf-red)] cursor-pointer " +
                  (commentOrder === "earliest" ? " text-[var(--bf-red)] font-semibold" : "")
                }
              >
                جدید ترین
              </span>
              <span
                onClick={() => setCommentOrder("best")}
                className={
                  "cursor-pointer " +
                  (commentOrder === "best" ? "text-[var(--color-white)] font-semibold" : "")
                }
              >
                مفید ترین
              </span>
            </div>
            <span>۱۲۲ دیدگاه</span>
          </div>
          {/* comment box */}
          <InfiniteScroll
            dataLength={comments.length}
            next={() =>
              findCommentByProductIdPaging(
                product?.id,
                commentOrder,
                comments,
                setComments,
                page,
                setPage,
                setHasMore
              )
            }
            hasMore={hasMore}
            loader={
              <div className="w-100 flex justify-center overflow-hidden ">
                <Loading className="w-5 h-5 "></Loading>
              </div>
            }
          >
            {comments?.map((comment) => {
              return (
                <div className=" border-t border-[var(--glass-border)] px-4 py-6 flex flex-col gap-y-4">
                  <div className=" flex gap-x-2 ">
                    <span className="text-[var(--color-white)]">
                      {comment?.user?.person?.firstName +
                        " " +
                        comment?.user?.person?.lastName}
                    </span>
                    <Tag
                      bgColor="bg-[var(--color-gold-light)]"
                      size="xs"
                      txtColor="text-[var(--color-gold)] font-sm"
                    >
                      خریدار
                    </Tag>
                    <span>{formatRelativeTime(comment?.dateCreated)}</span>
                  </div>
                  <div className="flex gap-x-1 text-sm">
                    <RateStar currentRate={comment?.rate} starRate={1} />
                    <RateStar currentRate={comment?.rate} starRate={2} />
                    <RateStar currentRate={comment?.rate} starRate={3} />
                    <RateStar currentRate={comment?.rate} starRate={4} />
                    <RateStar currentRate={comment?.rate} starRate={5} />
                  </div>
                  <span className="text-base text-[var(--color-white)]">
                    ‍‍ {comment?.content}
                  </span>
                  <div className=" flex justify-end gap-x-3 ">
                    {/* likecount */}
                    <div className="flex items-center gap-x-1 ">
                      <span>{comment?.likesCount}</span>
                      <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                    </div>
                    {/* dislikeCount */}
                    <div className="flex items-center  gap-x-1 ">
                      <span>{comment?.dislikesCount}</span>
                      <i class="fa fa-thumbs-down" aria-hidden="true"></i>
                    </div>
                  </div>
                </div>
              );
            })}
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
};
export default Comments;
