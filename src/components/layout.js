/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "gatsby";
import Helmet from "react-helmet";

import SocialFooter from "./socialFooter";

import Header from "./header";
import Row from "./row";
import EditionMenu from "./editionMenu";
import "../styles/global.scss";

const allMeta = require(`../utils/seo.json`);

const Layout = ({
	children,
	settings,
	year,
	style = { color: `#000`, backgroundColor: `#FFF`, textColor: `#000` },
	embeded,
	editionHeader = {},
	skMenu = {
		menuItems: []
	},
	translationSlug,
	slug = "",
	title = "",
	seoDescription = "",
	seoImage,
	isSk,
	pageName = ``
}) => {
	const meta = isSk ? allMeta.sk : allMeta.en;

	let parsedStyle = {
		...style,
		borderColor: style.textColor
	};

	const metaTitle = title ? `${meta.title} | ${title}` : meta.title;

	return (
		<>
			<Helmet defer={false}>
				<html lang={isSk ? `sk` : `en`} />
				<title>{metaTitle}</title>
				<meta charset="utf-8" />

				<meta
					name="google-site-verification"
					content="hZJ352wwwhOf9SvYQv2NNvHzK_jtFORAGDUf-LjNG90"
				/>

				{/* TEMPORARY */}

				<meta
					name="description"
					content={seoDescription || meta.description}
				/>
				<meta name="keywords" content={meta.keywords} />

				<link
					rel="alternate"
					hrefLang={isSk ? `en` : `sk`}
					href={`${meta.base_url}${translationSlug}`}
				/>

				{/* SOCIAL */}
				<meta property="og:locale" content={isSk ? `sk` : `en`} />
				<meta property="og:type" content="website" />
				<meta property="og:title" content={metaTitle} />
				<meta property="og:locale" content={isSk ? `sk_SK` : `en_US`} />
				<meta
					property="og:description"
					content={seoDescription || meta.description}
				/>
				<meta property="og:url" content={`${meta.base_url}${slug}`} />
				<meta property="og:site_name" content="NEXT" />
				<meta property="og:image" content={meta.image} />
				<meta property="twitter:image" content={meta.image} />
				<meta
					name="twitter:image:alt"
					content={seoDescription || meta.description}
				/>
				<meta name="twitter:card" content="summary_large_image" />

				<meta name="theme-color" content="#4c45fa" />

				{/* Makes the page extend on iOS all the way to the top edge */}
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta
					name="apple-mobile-web-app-status-bar-style"
					content="black-translucent"
				/>

				<script
					type="text/javascript"
					charset="UTF-8"
					src="//cdn.cookie-script.com/s/3c8bb78d413c45af28f18270091bf0dc.js"
				/>

				{process.env.CONTEXT === 'PRODUCTION' && <><script>
					{`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '120588998411833');
        fbq('track', 'PageView');
      `}
				</script>
					<noscript>
						{`
              <img height="1" width="1" style="display:none"
                src="https://www.facebook.com/tr?id=120588998411833&ev=PageView&noscript=1"
              />
            `}
					</noscript></>}


				{/* SNIPCART */}
			</Helmet>

			{/* <Header siteTitle={data.site.siteMetadata?.title || `Title`} /> */}
			<div
				className={`main-wrapper ${year
					? `edition-${year} menu-padding edition-web`
					: `no-edition festival-web`
					}`}
				id="main-wrapper"
				style={year ? parsedStyle : {}}
			>
				{!embeded && (
					<Header
						noLang={editionHeader?.menuItems || false}
						isSk={isSk}
						translationSlug={translationSlug}
						style={style}
					/>
				)}
				{editionHeader && editionHeader.menuItems && (
					<EditionMenu
						items={editionHeader.menuItems}
						skMenu={skMenu?.menuItems || []}
						bg={style.backgroundColor}
						translationSlug={translationSlug}
						isSk={isSk}
						pageName={pageName}
						sticky={embeded}
						colors={parsedStyle}
					/>
				)}
				<main>{children}</main>
				{embeded ? `` : <SocialFooter />}
				{embeded ? (
					``
				) : (
					<footer>
						<Row>
							<div className="col col-12">
								{isSk ? (
									<SkCredits />
								) : (
									<span className="credits">
										Website{" "}
										<br className="d-block d-md-none" />{" "}
										designed by{" "}
										<a
											href="https://robertfinkei.com"
											target="_blank"
										>
											Robert Finkei
										</a>{" "}
										<br className="d-block d-md-none" />
										<span className="d-none d-md-inline">
											{" "}
											and
										</span>{" "}
										developed by{" "}
										<a href="https://jondujaka.com">
											Jon Dujaka
										</a>
									</span>
								)}
							</div>
							<div className="col col-12 mb-6">
								<span className="credits">
									Copyright &copy; NEXT.{" "}
									<Link to="/privacy">
										Privacy Policy and Cookies
									</Link>
								</span>
							</div>
						</Row>
					</footer>
				)}
			</div>
		</>
	);
};

const SkCredits = () => (
	<span className="credits">
		Webdizajn:{" "}
		<a href="https://robertfinkei.com" target="_blank">
			Robert Finkei
		</a>{" "}
		<br className="d-block d-md-none" />/ Web Development:{" "}
		<a href="https://jondujaka.com">Jon Dujaka</a>
	</span>
);

Layout.propTypes = {
	children: PropTypes.node.isRequired,
	translationSlug: PropTypes.string,
	isSk: PropTypes.bool
};

export default Layout;
