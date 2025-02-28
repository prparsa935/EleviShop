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
    console.log(page)
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
export { findCommentByProductIdPaging };
