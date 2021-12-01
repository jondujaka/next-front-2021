import React from "react";
import Layout from "../components/layout";
import Row from "../components/row";

const PrivacyPolicy = ({ pageContext }) => {
	const isSk = pageContext.lang === `sk`;
	const translationSlug = pageContext.fakeTranslation;
	const { latestEdition } = pageContext;

	return (
		<Layout
			isSk={isSk}
			translationSlug={translationSlug}
			style={latestEdition}
		>
			<Row>
				<div className="col col-12 mt-5 mb-6">
					<h2 className="festival-page-title">Privacy Policy</h2>
				</div>
				<div className="col col-12 mt-5 mb-6">
					<p>Effective date: 2021-11-22</p>
					<p>Updated on: 2021-11-22</p>
					<p>
						<input id="csconsentcheckbox" type="checkbox" />
						<label for="csconsentcheckbox">
							I agree with Cookie Policy
						</label>
					</p>
					<p>
						This Privacy Policy explains the policies of Next
						Festival on the collection and use of the information we
						collect when you access https://nextfestival.sk (the
						“Service”). This Privacy Policy describes your privacy
						rights and how you are protected under privacy laws.
					</p>
					<p>
						By using our Service, you are consenting to the
						collection and use of your information in accordance
						with this Privacy Policy. Please do not access or use
						our Service if you do not consent to the collection and
						use of your information as outlined in this Privacy
						Policy. This Privacy Policy has been created with the
						help of
						<a
							target="_blank"
							href="https://cookie-script.com/privacy-policy-generator"
						>
							CookieScript Privacy Policy Generator
						</a>
						.
					</p>
					<p>
						Next Festival is authorized to modify this Privacy
						Policy at any time. This may occur without prior notice.
					</p>
					<p>
						Next Festival will post the revised Privacy Policy on
						the https://nextfestival.sk website
					</p>

					<h3>Collection and Use of Your Personal Information</h3>
					<h4>Information We Collect</h4>
					<p>
						When using our Service, you will be prompted to provide
						us with personal information used to contact or identify
						you. https://nextfestival.sk collects the following
						information:
					</p>

					<p>
						<ul>
							<li>Usage Data</li>
						</ul>
					</p>

					<p>Usage Data includes the following:</p>
					<p>
						<ul>
							<li>
								Internet Protocol (IP) address of computers
								accessing the site
							</li>
							<li>Web page requests</li>
							<li>Referring web pages</li>
							<li>Browser used to access site</li>
							<li>Time and date of access</li>
						</ul>
					</p>
					<h4>How We Collect Information</h4>
					<p>
						https://nextfestival.sk collects and receives
						information from you in the following manner:
						<ul>
							<li>When you interact with our Service.</li>
							<li>From external, public sources.</li>
						</ul>
					</p>
					<p>
						Your information will be stored for up to 30 days after
						it is no longer required to provide you the services.
						Your information may be retained for longer periods for
						reporting or record- keeping in accordance with
						applicable laws. Information which does not identify you
						personally may be stored indefinitely.
					</p>

					<h4>How We Use Your Information</h4>
					<p>
						https://nextfestival.sk may use your information for the
						following purposes:
						<ul>
							<li>
								<b>Providing and maintaining our Service,</b> as
								well as monitoring the usage of our Service.
							</li>
							<li>
								<b>For other purposes.</b> Next Festival will
								use your information for data analysis to
								identify usage trends or determine the effective
								of our marketing campaigns when reasonable. We
								will use your information to evaluate and
								improve our Service, products, services, and
								marketing efforts.
							</li>
						</ul>
					</p>

					<h4>Third-party Sharing</h4>
					<p>
						Any third party we share your information with must
						disclose the purpose for which they intend to use your
						information. They must retain your information only for
						the duration disclosed when requesting or receiving said
						information. The third-party service provider must not
						further collect, sell, or use your personal information
						except as necessary to perform the specified purpose.
					</p>
					<p>
						Your information may be shared to a third-party for
						reasons including:
						<ul>
							<li>
								<b>Analytics information.</b> Your information
								might be shared with online analytics tools in
								order to track and analyse website traffic.
							</li>
							<li>
								<b>Payment processing and recovery services.</b>
								Your information will be used in order to
								process payments in the event of a purchase,
								refund, or other similar request.
							</li>
						</ul>
					</p>
					<p>
						If you choose to provide such information during
						registration or otherwise, you are giving Next Festival
						permission to use, share, and store that information in
						a manner consistent with this Privacy Policy.
					</p>

					<p>
						Your information may be disclosed for additional
						reasons, including:
						<ul>
							<li>
								Complying with applicable laws, regulations, or
								court orders.
							</li>
							<li>
								Responding to claims that your use of our
								Service violates third-party rights.
							</li>
							<li>
								Enforcing agreements you make with us, including
								this Privacy Policy.
							</li>
						</ul>
					</p>

					<h4>Cookies</h4>
					<p>
						Cookies are small text files that are placed on your
						computer by websites that you visit. Websites use
						cookies to help users navigate efficiently and perform
						certain functions. Cookies that are required for the
						website to operate properly are allowed to be set
						without your permission. All other cookies need to be
						approved before they can be set in the browser.
					</p>
					<p>
						<ul>
							<li>
								<b>Strictly necessary cookies.</b> Strictly
								necessary cookies allow core website
								functionality such as user login and account
								management. The website cannot be used properly
								without strictly necessary cookies.
							</li>
							<li>
								<b>Performance cookies.</b> Performance cookies
								are used to see how visitors use the website,
								eg. analytics cookies. Those cookies cannot be
								used to directly identify a certain visitor.
							</li>
						</ul>
					</p>

					<div class="cookie-report-container">
						<p data-cookiereport="true">
							You can change your consent to cookie usage below.
						</p>
						<script
							type="text/javascript"
							charset="UTF-8"
							data-cookiescriptreport="report"
							data-cs-lang="en"
							src="//report.cookie-script.com/r/3c8bb78d413c45af28f18270091bf0dc.js"
						></script>
					</div>

					<h4>Security</h4>
					<p>
						Your information’s security is important to us.
						https://nextfestival.sk utilizes a range of security
						measures to prevent the misuse, loss, or alteration of
						the information you have given us. However, because we
						cannot guarantee the security of the information you
						provide us, you must access our service at your own
						risk.
					</p>
					<p>
						Next Festival is not responsible for the performance of
						websites operated by third parties or your interactions
						with them. When you leave this website, we recommend you
						review the privacy practices of other websites you
						interact with and determine the adequacy of those
						practices.
					</p>

					<h4>Contact Us</h4>
					<p>
						For any questions, please contact us through the
						following methods:
					</p>
					<p>Name: Next Festival</p>
					<p>Address: Address, Bratislava, SK</p>
					<p>Email: info(at)nextfestival.sk</p>
					<p>Website: https://nextfestival.sk</p>
				</div>
			</Row>
		</Layout>
	);
};

export default PrivacyPolicy;
