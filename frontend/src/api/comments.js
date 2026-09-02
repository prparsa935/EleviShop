import axios from "axios";
import { serverAddress } from "../App";

const findCommentByProductIdPaging = async (
  productId,
  commentOrder,
  commentList,
  setCommentList,
  page,
  setPage,
  setHasMore
) => {
  try {
    const res = await axios.get(
      serverAddress + "comment/product/" + productId,
      { params: { commentOrder: commentOrder, pageNumber: page } }
    );

    if (res.status === 200) {
      const resData = await res.data;

      if (resData.length === 0) {
        setHasMore(false);

        if (page === 1) {
          setCommentList([]);
        }
      } else {
        setHasMore(true);

        setPage(page + 1);
        setCommentList([...commentList, ...resData]);
      }
    }
  } catch (error) {
    console.log(error)
    setHasMore(false);

    if (page === 1) {
      setCommentList([]);
    }
  }
};

// average rate + total comments of a product
const fetchCommentStats = async (productId, setStats) => {
  try {
    const res = await axios.get(
      serverAddress + "comment/product/" + productId + "/stats"
    );
    if (res.status === 200) {
      setStats(res.data);
    }
  } catch (error) {
    console.log(error);
  }
};

// isLike: true = like, false = dislike (clicking again removes the reaction)
const setCommentReaction = async (commentId, isLike) => {
  const res = await axios.post(
    serverAddress + "comment/" + commentId + "/reaction",
    { isLike }
  );
  return res.data?.data;
};

export { findCommentByProductIdPaging, fetchCommentStats, setCommentReaction };
