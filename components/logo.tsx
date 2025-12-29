import Link from "next/link";
import React from "react";
import Image from "next/image";
const logoSrc = encodeURI("/genstar logo.png");

export const Logo = ({
	width = 140,
	height = 50,
}: {
	width?: number;
	height?: number;
}) => {
	return (
		<Link href="/">
			<Image
				src={logoSrc}
				alt="GenStar Printing Services"
				width={width}
				height={height}
				priority
			/>
		</Link>
	);
};
