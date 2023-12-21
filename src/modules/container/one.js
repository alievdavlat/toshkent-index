import { get } from "lodash";
import PropTypes from "prop-types";
import { useGetOne } from '@/hooks/crud';

const ContainerOne = ({ name, onSuccess, onError, url, children, dataKey, params, queryOption, propId }) => {
	const data = useGetOne({ name, onSuccess, onError, url, params, queryOption, propId });
	const newData = {
		item: get(data, dataKey)
	};

	return children({ item: get(newData, "item"), ...data });
};

ContainerOne.propTypes = {
	name: PropTypes.string.isRequired,
	url: PropTypes.string.isRequired,
	dataKey: PropTypes.string,
	onSuccess: PropTypes.func,
	onError: PropTypes.func
};

ContainerOne.defaultProps = {
	dataKey: "data",
	onSuccess: () => {},
	onError: () => {}
};

export default ContainerOne;