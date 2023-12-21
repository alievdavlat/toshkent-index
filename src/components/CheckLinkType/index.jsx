import Link from 'next/link';

const CheckLinkType = ({ url, title, ...props }) => {

	const link = ["http", "https"];
	return link.includes(url?.slice(0, 4)) ? (
		<a {...props} href={url} rel="noreferrer" target={"_blank"} className="btn">
			{title}
		</a>
	) : (
		<Link {...props} href={url.split(' ').join('-')} className="btn">
			{title}
		</Link>
	);
};

export default CheckLinkType;

