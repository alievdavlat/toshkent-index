import React from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import { useGetAll } from '@/hooks/crud';

const ContainerAll = ({ name, url, params, onSuccess, onError, dataKey, children, appendData, auth = false, }) => {
	const data = useGetAll({ name, url, params, onSuccess, onError, auth });
	const newData = {
		items: get(data, `data.${dataKey}`),
		meta: {
			currentPage: get(data, "data.meta.current_page"),
			pageCount: get(data, "data.meta.last_page"),
			perPage: get(data, "data.meta.per_page"),
			totalCount: get(data, "data.meta.total")
		}
	};
	return <>{children({ items: get(newData, "items"), meta: get(newData, "meta"), ...data })}</>;
};

ContainerAll.propTypes = {
	name: PropTypes.string.isRequired,
	url: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
	params: PropTypes.object,
	onSuccess: PropTypes.func,
	onError: PropTypes.func,
	dataKey: PropTypes.string
};

ContainerAll.defaultProps = {
	onSuccess: () => {},
	onError: () => {},
	dataKey: "data"
};

export default ContainerAll;