import axios from "axios";
import { useCallback, useEffect, useState } from "react";

axios.defaults.baseURL = "https://geektrust.s3-ap-southeast-1.amazonaws.com";

const useAxios = ({ url, method, body = null, headers = null }) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const callApi = useCallback(() => {
    axios[method](url, JSON.parse(headers), JSON.parse(body))
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [method, url, headers, body]);

  useEffect(() => {
    callApi();
  }, [callApi]);

  return { response, error, loading };
};

export default useAxios;
