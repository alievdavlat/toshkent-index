import React, {useEffect, useState} from 'react';

// import {LoadMoreVisible, Spinner} from "components";
// import {Search} from "components/SmallComponents";
import { ContainerAll } from '@/modules/container';

import get from "lodash/get";
import helpers from '@/services/helpers';
import FMUpload from "./fmUpload";
import {useDebounce} from "use-debounce";

const FmList = ({selected, setSelected, filterType, setLoading, isLoading, activeFolder}) => {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [searchQuery] = useDebounce(query, 600);

  useEffect(() => {
    setPage(1);
  }, [filterType]);

  return (
    <FMUpload {...{setLoading, isLoading, filterType, activeFolder}}/>
  );
};

export default FmList;