import axios from "axios";
import { useEffect, useState } from "react";
export default function useBookSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [books, setBooks] = useState([]);
  const [hasMoreResults, setHasMoreResults] = useState(false);

  useEffect(() => {
    setBooks([]);
  }, [query]);
  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: "GET",
      url: "https://openlibrary.org/search.json",
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setBooks((prevBooks) => {
          return [
            ...new Set([
              ...prevBooks,
              ...res?.data?.docs?.map((book) => book.title),
            ]),
          ];
        });
        setHasMoreResults(res?.data?.docs?.length);
        setLoading(false);
      })
      .catch((error) => {
        if (axios.isCancel(error)) return;
        setError(true);
      });

    return () => cancel();
  }, [query, pageNumber]);
  return { loading, error, books, hasMoreResults };
}
