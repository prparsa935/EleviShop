import { useContext, useEffect, useState } from "react";
import Button from "../Button/Button";
import Tag from "../tag/Tag";
import {
  findCommentByProductIdPaging,
  fetchCommentStats,
  setCommentReaction,
} from "../../api/comments";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../icons/Loading";
import { formatRelativeTime, formatNumber } from "../../utils/helperMehods";
import RateStar from "../ratestar/RateStar";
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Comments = ({ setCommentModalActive, product, setToastList, refreshKey }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [commentOrder, setCommentOrder] = useState("earliest");
  const [stats, setStats] = useState({ averageRate: 0, commentsCount: 0 });
  const [reactingIds, setReactingIds] = useState([]);

  useEffect(() => {
    if (!product?.id) return;
    setComments([]);
    setPage(1);
    setHasMore(true);
    findCommentByProductIdPaging(
      product?.id,
      commentOrder,
      [],
      setComments,
      1,
      setPage,
      setHasMore
    );
    fetchCommentStats(product?.id, setStats);
  }, [product?.id, commentOrder, refreshKey, user]);

  const handleReaction = async (comment, isLike) => {
    if (!user) {
      setToastList?.((prev) => [
        ...prev,
        { type: "danger", message: "برای ثبت واکنش ابتدا وارد حساب خود شوید" },
      ]);
      navigate("/login");
      return;
    }
    if (reactingIds.includes(comment.id)) return;
    setReactingIds((prev) => [...prev, comment.id]);
    try {
      const result = await setCommentReaction(comment.id, isLike);
      setComments((prev) =>
        prev.map((item) =>
          item.id === comment.id
            ? {
                ...item,
                likesCount: result?.likesCount ?? item.likesCount,
                dislikesCount: result?.dislikesCount ?? item.dislikesCount,
                // null = reaction removed
                likes: result?.myReaction != null ? [{ isLike: result.myReaction }] : [],
              }
            : item
        )
      );
    } catch (error) {
      const message =
        error?.response?.data?.overallError?.message ??
        "در ثبت واکنش مشکلی پیش آمد";
      setToastList?.((prev) => [...prev, { type: "danger", message }]);
    } finally {
      setReactingIds((prev) => prev.filter((id) => id !== comment.id));
    }
  };

  return (
    <div className="flex flex-col">
      <h3 className=" text-lg font-semibold mb-5">امتیاز و دیدگاه کاربران</h3>
      <div className="flex md:flex-row flex-col gap-y-5">
        {/* right section (side section) */}
        <div>
          <div className="md:w-[300px] w-full p-3 flex flex-col gap-y-4 ">
            <div className="flex items-center gap-x-1 ">
              <h3 className="text-lg font-semibold">
                {formatNumber(stats?.averageRate ?? 0) ?? "۰"}
              </h3>
              <span className="text-sm"> از</span>
              <span className="text-sm">۵</span>
            </div>
            <div className="flex gap-x-1 text-sm">
              <RateStar currentRate={stats?.averageRate ?? 0} starRate={1} />
              <RateStar currentRate={stats?.averageRate ?? 0} starRate={2} />
              <RateStar currentRate={stats?.averageRate ?? 0} starRate={3} />
              <RateStar currentRate={stats?.averageRate ?? 0} starRate={4} />
              <RateStar currentRate={stats?.averageRate ?? 0} starRate={5} />
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
                  " cursor-pointer " +
                  (commentOrder === "earliest"
                    ? "text-[var(--bf-red)] font-semibold"
                    : "")
                }
              >
                جدید ترین
              </span>
              <span
                onClick={() => setCommentOrder("best")}
                className={
                  " cursor-pointer " +
                  (commentOrder === "best"
                    ? "text-[var(--color-white)] font-semibold"
                    : "")
                }
              >
                مفید ترین
              </span>
            </div>
            <span>
              {formatNumber(stats?.commentsCount ?? 0) ?? "۰"} دیدگاه
            </span>
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
              const myReaction = comment?.likes?.[0]?.isLike;
              return (
                <div key={comment?.id} className=" border-t border-[var(--glass-border)] px-4 py-6 flex flex-col gap-y-4">
                  <div className=" flex gap-x-2 ">
                    <span className="text-[var(--color-white)]">
                      {comment?.user?.person?.firstName +
                        " " +
                        comment?.user?.person?.lastName}
                    </span>
                    {comment?.isBuyer ? (
                      <Tag
                        bgColor="bg-[var(--color-gold-light)]"
                        size="xs"
                        txtColor="text-[var(--color-gold)] font-sm"
                      >
                        خریدار
                      </Tag>
                    ) : (
                      <></>
                    )}
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
                    <div
                      onClick={() => handleReaction(comment, true)}
                      className={
                        "flex items-center gap-x-1 cursor-pointer transition-colors " +
                        (myReaction === true ? "text-[var(--color-gold)]" : "")
                      }
                    >
                      <span>{comment?.likesCount ?? 0}</span>
                      <i
                        className={
                          myReaction === true
                            ? "fa-solid fa-thumbs-up"
                            : "fa fa-thumbs-up"
                        }
                        aria-hidden="true"
                      ></i>
                    </div>
                    {/* dislikeCount */}
                    <div
                      onClick={() => handleReaction(comment, false)}
                      className={
                        "flex items-center  gap-x-1 cursor-pointer transition-colors " +
                        (myReaction === false ? "text-[var(--bf-red)]" : "")
                      }
                    >
                      <span>{comment?.dislikesCount ?? 0}</span>
                      <i
                        className={
                          myReaction === false
                            ? "fa-solid fa-thumbs-down"
                            : "fa fa-thumbs-down"
                        }
                        aria-hidden="true"
                      ></i>
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
