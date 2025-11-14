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
				<div className="col col-12 mt-5 mb-6 privacy">
					<h2>INFORMÁCIA O SPRACÚVANÍ OSOBNÝCH ÚDAJOV
					</h2>
					<div class="section">
						<p>Atrakt Art, občianske združenie je organizátorom spoločenskej a kultúrnej udalosti – medzinárodného festivalu NEXT Festival a v rámci svojej činnosti venuje najvyššiu pozornosť ochrane osobných údajov autorov, návštevníkov, prípadne iných dotknutých osôb. Táto Informácia o spracúvaní osobných údajov obsahuje informácie o spracúvaní osobných údajov autorov, návštevníkov a iných fyzických osôb, ktorých osobné údaje je nevyhnutné získať a spracúvať pri vykonávaní našej činnosti. Vaše osobné údaje sú spracúvané v súlade se všetkými všeobecne záväznými právnymi predpismi platnými v Slovenskej republike, najmä, nie však výlučne v súlade s Nariadením Európskeho Parlamentu a Rady (EÚ) 2016/679 z 27. apríla 2016 o ochrane fyzických osôb pri spracúvaní osobných údajov a o voľnom pohybe takýchto údajov, ktorým sa zrušuje smernica 95/46/ES (všeobecné nariadenie o ochrane údajov) (ďalej len „Nariadenie"), zákonom č. 18/2018 Z. z. o ochrane osobných údajov (ďalej len „Zákon o ochrane osobných údajov").</p>

						<p>Odporúčame Vám, aby ste si dôkladne prečítali túto Informáciu o spracúvaní osobných údajov a oboznámili sa tak so všetkými svojimi právami. V prípade akýchkoľvek nejasností týkajúcich sa obsahu tejto Informácie o spracúvaní osobných údajov, kontaktujte prosím nižšie uvedenú kontaktnú osobu.</p>
					</div>

					<div class="section">
						<h4>V tejto Informácii o spracúvaní osobných údajov Vás informujeme o tom:</h4>
						<ul>
							<li>Kto sme a ako nás môžete kontaktovať</li>
							<li>Na koho sa vzťahuje táto Informácia o spracúvaní osobných údajov</li>
							<li>Aké osobné údaje zhromažďujeme</li>
							<li>Ako používame vaše osobné údaje a aký je právny základ spracúvania vašich osobných údajov</li>
							<li>Komu sprístupňujeme vaše osobné údaje a prečo</li>
							<li>Ako dlho uchovávame vaše osobné údaje</li>
							<li>Ako prenášame Vaše osobné údaje mimo Európskej únie</li>
							<li>Aké sú vaše práva a ako si ich môžete uplatniť</li>
						</ul>
					</div>

					<h4>KTO SME A AKO NÁS MÔŽETE KONTAKTOVAŤ</h4>

					<div class="contact-info">
						<p><strong>Prevádzkovateľom pri spracúvaní Vašich osobných údajov je:</strong></p>
						<p>
							<strong>ATRAKT ART, občianske združenie</strong><br />
							Sídlo: Gallayová 43, 841 02, Bratislava<br />
							IČO: 36066273
						</p>
						<p>(ďalej označený aj ako „prevádzkovateľ", „NEXT Festival")</p>
						<p>
							<strong>Kontaktná osoba:</strong><br />
							Mária Hejtmánková - maria (at) nextfestival (dot) sk
						</p>
					</div>

					<h4>NA KOHO SA VZŤAHUJE TÁTO INFORMÁCIA O SPRACÚVANÍ OSOBNÝCH ÚDAJOV</h4>

					<ul>
						<li>fyzické osoby – autori, distribútori, producenti, prípadne iní tvorcovia - fyzické osoby podieľajúce sa na výrobe filmu resp. diela</li>
						<li>fyzické osoby – hostia programu festivalu</li>
						<li>fyzické osoby – pozvaní účastníci, bežní návštevníci festivalu</li>
						<li>fyzické osoby – zástupcovia médií</li>
						<li>fyzické osoby – registrovaný zákazníci, potenciálni záujemcovia o účasť na festivale</li>
						<li>fyzické osoby - dodávatelia tovarov a služieb, dobrovoľníci, resp. iní zmluvní partneri, vrátane oprávnených zástupcov a kontaktných osôb dodávateľov tovarov a služieb – právnických osôb</li>
						<li>ďalšie fyzické osoby, ktorých osobné údaje spracúvame za podmienok uvedených ďalej v tejto Informácií o spracúvaní osobných údajov</li>
					</ul>

					<h4>AKÉ OSOBNÉ ÚDAJE ZHROMAŽĎUJEME</h4>

					<p>Rozsah osobných údajov, ktoré zhromažďujeme a používame, bude závisieť od toho, prečo ich potrebujeme. Zhromažďujeme len take osobné údaje, ktoré nevyhnutne potrebujeme na dosiahnutie stanoveného účelu spracúvania. Spracúvame najmä nasledovné kategórie Vašich osobných údajov:</p>

					<ul>
						<li>meno, priezvisko</li>
						<li>adresa trvalého alebo iného pobytu, adresa bydliska</li>
						<li>dátum narodenia</li>
						<li>číslo dokladu totožnosti, cestovného pasu (v prípade, ak zabezpečujeme letenku)</li>
						<li>údaje zo životopisu</li>
						<li>bankové spojenie</li>
						<li>fotografia (podobizeň)</li>
						<li>videozáznam a zvukový záznam (prejavy osobnej povahy)</li>
						<li>pohlavie</li>
						<li>údaje o zamestnávateľovi, pracovná pozícia</li>
						<li>telefónne číslo</li>
						<li>e-mailová adresa</li>
						<li>IČO</li>
						<li>IČ DPH</li>
						<li>fakturačné a platobné údaje</li>
						<li>vlastnoručný podpis</li>
					</ul>

					<h4>AKO POUŽÍVAME VAŠE OSOBNÉ ÚDAJE A AKÝ JE PRÁVNY ZÁKLAD SPRACÚVANIA VAŠICH OSOBNÝCH ÚDAJOV</h4>

					<p>V tejto časti Vás chceme informovať o tom, na aké účely, akým spôsobom a prečo používame Vaše osobné údaje, a tiež aký je právny základ spracúvania Vašich osobných údajov.</p>

					<table>
						<thead>
							<tr>
								<th>Účel spracúvania osobných údajov</th>
								<th>Právny základ spracúvania osobných údajov</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<strong>Vykonávanie činností spojených s prihlásením/výberom filmov na festival</strong><br /><br />
									(Výzva na prihlasovanie filmov, výber filmov na festival z prihlásených, zostavovanie programu, kontakt s autormi/tvorcami/prihlasovateľmi, kuratelovaný výber filmov, výber špeciálnych hostí, programových hostí, činnosti spojené so získavaním práv k filmu, rokovanie s distribútormi)
								</td>
								<td>Plnenie zmluvy<br />(čl. 6 ods. 1 písm. b) Nariadenia)</td>
							</tr>
							<tr>
								<td>
									<strong>Vykonávanie činností spojených s propagáciou festivalu a zabezpečením preukaznej dokumentácie pre partnerov festivalu</strong><br /><br />
									(Uverejnenie informácií o vybraných filmoch a ich autoroch v propagačných materiáloch festivalu, tlačové správy, vyhotovenie zvukového a obrazového záznamu a portrétnych fotografií za účelom propagácie vybraných filmov, ich autorov a tvorcov)
								</td>
								<td>Oprávnený záujem<br />(čl. 6 ods. 1 písm. f) Nariadenia)</td>
							</tr>
							<tr>
								<td>
									<strong>Vykonávanie činností spojených so zabezpečením účasti hostí, členov poroty a návštevníkov</strong><br /><br />
									(Tvorba poroty, výber a zasielanie pozvánok členom poroty, zasielanie pozvánok programovým hosťom, prihlásenie účastníka na voliteľné workshopy s obmedzenou kapacitou, zasielanie pozvánok vybraným návštevníkom, predaj lístkov na festival bežným návštevníkom)
								</td>
								<td>Vykonanie opatrení pred uzatvorením zmluvy – predzmluvný vzťah<br /><br />Plnenie zmluvy<br />(čl. 6 ods. 1 písm. b) Nariadenia)</td>
							</tr>
							<tr>
								<td><strong>Vyhlásenie výsledkov súťaže na záverečnom ceremoniáli festivalu</strong></td>
								<td>Oprávnený záujem<br />(čl. 6 ods. 1 písm. f) Nariadenia)</td>
							</tr>
							<tr>
								<td>
									<strong>Vykonávanie činností spojených so zabezpečením dodávok tovaru a služieb pre festival</strong><br /><br />
									(Prenájom priestorov a techniky, zabezpečenie občerstvenia, strážnej služby, služieb zdravotníkov a pod., výber spolupracovníkov, nábor dobrovoľníkov a guidov na vykonávanie rôznych činností a pomocných prác spojených s organizáciou a zabezpečením priebehu festivalu, konkrétne dojednanie komerčných/technických podmienok s vybraným dodávateľom/poskytovateľom služieb, príprava návrhu zmluvy, finalizácia a podpis zmluvy s dodávateľom, vystavenie a zaslanie objednávky, potvrdenie objednávky zo strany dodávateľa)
								</td>
								<td>Vykonanie opatrení pred uzatvorením zmluvy – predzmluvný vzťah<br /><br />Plnenie zmluvy<br />(čl. 6 ods. 1 písm. b) Nariadenia)</td>
							</tr>
							<tr>
								<td>
									<strong>Vykonávanie činností súvisiacich s distribúciou krátkych filmov</strong><br /><br />
									(Oslovenie vybraných autorov príp. iných tvorcov krátkych filmov, rokovanie a uzatvorenie licenčnej zmluvy)
								</td>
								<td>Vykonanie opatrení pred uzatvorením zmluvy – predzmluvný vzťah<br /><br />Plnenie zmluvy<br />(čl. 6 ods. 1 písm. b) Nariadenia)</td>
							</tr>
							<tr>
								<td>
									<strong>Zasielanie newslettra</strong><br /><br />
									(Informovanie existujúcich zákazníkov a potenciálnych záujemcov o účasť na festivale o novinkách, aktuálnych a pripravovaných podujatiach organizovaných prevádzkovateľom, výhodných ponukách a pod., najmä za účelom propagácie a prezentácie produktov festivalu)
								</td>
								<td>Oprávnený záujem<br />(čl. 6 ods. 1 písm. f) Nariadenia)</td>
							</tr>
							<tr>
								<td>
									<strong>Kontaktný formulár</strong><br /><br />
									(Kontaktovanie fyzických osôb prostredníctvom e-mailu, prípadne iným spôsobom za účelom poskytnutia odpovedí na otázky alebo žiadosti týkajúce sa činnosti alebo služieb prevádzkovateľa v prípade, žiadosti zaslanej prostredníctvom kontaktného formulára zverejneného na webstránke prevádzkovateľa)
								</td>
								<td>Oprávnený záujem<br />(čl. 6 ods. 1 písm. f) Nariadenia)</td>
							</tr>
							<tr>
								<td>
									<strong>Komunikácia s médiami</strong><br /><br />
									(Zasielanie tlačových správ, pozvánok na tlačové konferencie, dopytov na mediálne partnerstvá a výziev na akreditáciu predstaviteľom médií, za účelom propagácie a prezentácie produktov festivalu)
								</td>
								<td>Oprávnený záujem<br />(čl. 6 ods. 1 písm. f) Nariadenia)</td>
							</tr>
							<tr>
								<td>
									<strong>Vyhotovovanie foto a videodokumentácie z festivalu</strong><br /><br />
									(Vyhotovovanie a uchovávanie dokumentácie za účelom propagácie festivalu pre ďalšie ročníky, pre partnerov festivalu a donorov, za účelom prezentácie festivalu ako významnej kultúrnej a spoločenskej udalosti, plnenia osvetovej, publikačnej, vedeckej, výchovnej, vzdelávacej a konfrontačnej funkcie festivalu v súvislosti s domácou a zahraničnou produkciou animovaných filmov)
								</td>
								<td>Oprávnený záujem<br />(čl. 6 ods. 1 písm. f) Nariadenia)</td>
							</tr>
							<tr>
								<td>
									<strong>Vybavovanie sťažností</strong><br /><br />
									(Vybavovanie reklamácií, sťažností, žiadostí, či podnetov, uplatňovanie práv a právnych nárokov, ktoré sa týkajú dotknutých osôb alebo prevádzkovateľa)
								</td>
								<td>Oprávnený záujem<br />(čl. 6 ods. 1 písm. f) Nariadenia)</td>
							</tr>
							<tr>
								<td>
									<strong>Vedenie účtovníctva a činnosti súvisiace s ekonomickou agendou</strong><br /><br />
									(Vedenie účtovníctva a vyhotovovanie účtovných dokladov, správa a fakturácia služieb poskytnutých na základe zmlúv, spracúvanie účtovných, daňových dokladov a faktúr, zabezpečenie auditu účtovnej závierky, prijímanie peňažných a nepeňažných plnení, zabezpečenie vyradenia dokumentácie)
								</td>
								<td>Plnenie zákonnej povinnosti<br />(čl. 6 ods. 1 písm. c) Nariadenia)<br /><br />Plnenie zmluvy<br />(čl. 6 ods. 1 písm. b) Nariadenia)</td>
							</tr>
							<tr>
								<td>
									<strong>Prevádzkovanie webstránky</strong><br /><br />
									(Spravovanie webstránky prevádzkovateľa, zlepšovanie ponuky tovarov a služieb prevádzkovateľa. Prevádzkovateľ na webstránkach využíva súbory cookie a ďalšie podobné technológie za účelom umožnenia čo najlepšieho užívania funkcie webstránok. Podrobné informácie o súboroch cookie a o možnosti ich vypnutia sú uvedené v Informácii o používaní súborov cookie a iných internetových techonológií)
								</td>
								<td>Oprávnený záujem<br />(čl. 6 ods. 1 písm. f) Nariadenia)</td>
							</tr>
						</tbody>
					</table>

					<h4>KOMU SPRÍSTUPŇUJEME VAŠE OSOBNÉ ÚDAJE A PREČO</h4>

					<p>V tejto časti uvádzame, ktorým príjemcom môžeme poskytovať Vaše osobné údaje, či ich s nimi zdieľať. Niektoré Vaše osobné údaje môžeme poskytovať subjektom, ktoré nám poskytujú služby, subjektom, ktoré informujú o našej činnosti, alebo subjektom, ktoré na základe príslušných všeobecne záväzných právnych predpisov kontrolujú vykonávanie alebo financovanie našej činnosti. Od všetkých poskytovateľov služieb a ďalších subjektov, ktorým sprístupňujeme osobné údaje striktne vyžadujeme, aby dôsledne dbali na ochranu osobných údajov a nepoužívali Vaše osobné údaje na vlastné marketingové účely, pokiaľ im na to sami neudelíte súhlas. Zdieľame iba tie osobné údaje, ktoré tieto subjekty nevyhnutne potrebujú na poskytovanie služieb. Ide napríklad o nasledovné subjekty:</p>

					<ul>
						<li>spolupracovníkom a členom tímu NEXT Festival</li>
						<li>poskytovatelia ubytovacích služieb</li>
						<li>letecké spoločnosti/sprostredkovatelia služieb leteckých spoločností, cestovné agentúry, dopravcovia</li>
						<li>médiá, novinári</li>
						<li>účtovníctvo, daňové poradenstvo, audítorské služby</li>
						<li>Fond na podporu umenia, Nadácia mesta Bratislavy, Staré mesto Bratislava pod.</li>
						<li>technologické služby (napr. poskytovanie a správa virtuálneho prostredia, vývoj, prevádzka a správa aplikácií, poskytovanie služieb hardvérového servisu na všetkých zariadeniach infraštruktúry, poskytovanie systémovej podpory na IT infraštruktúre, správa siete, ticketingová služba (tootoot s.r.o., Slovenská republika)</li>
					</ul>

					<p>Niektoré Vaše osobné údaje môžeme poskytovať štátnym orgánom, správnym a samosprávnym orgánom, a iným orgánom verejnej moci a správy, v prípadoch, keď nám taká povinnosť vyplýva zo zákona, alebo je to potrebné na určenie, uplatnenie alebo obhajobu práv a oprávnených záujmov nášho združenia, alebo tretích osôb.</p>

					<h4>AKO DLHO UCHOVÁVAME VAŠE OSOBNÉ ÚDAJE</h4>

					<p>Doba, počas ktorej budeme Vaše osobné údaje uchovávať je vo väčšine prípadov najviac 10 rokov odo dňa kedy sme osobné údaje získali. Vo výnimočných prípadoch, ak to okolnosti vyžadujú, sa môže doba uchovávania osobných údajov predĺžiť z dôvodov uplatnenia, preukázania, obhajovania a/alebo výkonu práv, nárokov a oprávnených záujmov Vás ako dotknutej osoby alebo našich alebo z dôvodu archivácie niektorých dokumentov a záznamov na účely spoločenského, kultúrneho, výchovného, vzdelávacieho a iného obdobného významu, a to v nevyhnutnej miere.</p>

					<h4>AKO PRENÁŠAME VAŠE OSOBNÉ ÚDAJE MIMO EURÓPSKEJ ÚNIE</h4>

					<p>Nemáme v úmysle uskutočňovať cezhraničný prenos Vašich osobných údajov do tretích krajín mimo Európskeho hospodárskeho priestoru (EÚ, Island, Nórsko a Lichtenštajnsko).</p>

					<h4>AKÉ SÚ VAŠE PRÁVA A AKO SI ICH MÔŽETE UPLATNIŤ</h4>

					<p>Ak o Vás spracúvame osobné údaje výlučne na základe Vášho súhlasu so spracúvaním osobných údajov (čl. 6 ods. 1 písm. a) Nariadenia), máte právo kedykoľvek svoj súhlas odvolať. Odvolanie súhlasu nemá vplyv na zákonnosť spracúvania osobných údajov založeného na súhlase pred jeho odvolaním. Udelený súhlas môžete odvolať rovnakým spôsobom, akým bol súhlas udelený, t. j. písomne.</p>

					<p>V súvislosti so spracúvaním Vašich osobných údajov máte v rozsahu ustanovenom všeobecne záväznými právnymi predpismi nasledovné práva:</p>

					<h4>1. Právo namietať proti spracúvaniu osobných údajov</h4>
					<p>Máte právo kedykoľvek namietať z dôvodov týkajúcich sa Vašej konkrétnej situácie proti spracúvaniu osobných údajov, ktoré sa Vás týka, ak je spracúvanie vykonávané na splnenie úlohy realizovanej vo verejnom záujme alebo nevyhnutné na účely oprávnených záujmov, ktoré sledujeme.</p>

					<h4>2. Právo na prístup k osobným údajom</h4>
					<p>Na základe Vašej žiadosti adresovanej kontaktnej osobe uvedenej v tejto Informácii o spracúvaní osobných údajov Vám poskytneme kópiu osobných údajov, ktoré o Vás spracúvame, a to prostredníctvom e-mailu, ak nepožiadate o iný spôsob poskytnutia osobných údajov.</p>

					<h4>3. Právo na opravu osobných údajov</h4>
					<p>Máte právo na to, aby sme bez zbytočného odkladu opravili nesprávne osobné údaje, ktoré sa Vás týkajú. So zreteľom na účely spracúvania osobných údajov máte tiež právo na doplnenie neúplných osobných údajov.</p>

					<h4>4. Právo na vymazanie (právo na zabudnutie)</h4>
					<p>Máte právo, aby sme bez zbytočného odkladu vymazali Vaše osobné údaje v prípade, ak:</p>
					<ul>
						<li>osobné údaje už nie sú potrebné na účely, na ktoré sa získavali alebo inak spracúvali;</li>
						<li>odvoláte súhlas, na základe ktorého sa spracúvanie vykonáva, a ak neexistuje iný právny základ pre spracúvanie;</li>
						<li>namietate voči spracúvaniu Vašich osobných údajov z dôvodov uvedených v bode 1. vyššie a neprevažujú žiadne oprávnené dôvody na spracúvanie;</li>
						<li>sa Vaše osobné údaje sa spracúvali nezákonne;</li>
						<li>Vaše osobné údaje musia byť vymazané, aby sa splnila zákonná povinnosť podľa práva Európskej únie alebo práva Slovenskej republiky.</li>
					</ul>

					<h4>5. Právo na obmedzenie spracúvania osobných údajov</h4>
					<p>Máte právo, aby sme obmedzili spracúvanie Vašich osobných údajov v prípade, ak:</p>
					<ul>
						<li>ste napadli správnosť osobných údajov, a to počas obdobia umožňujúceho nám overiť správnosť osobných údajov;</li>
						<li>spracúvanie je protizákonné a namietate proti vymazaniu osobných údajov a žiadate namiesto toho obmedzenie ich použitia;</li>
						<li>už nepotrebujeme Vaše osobné údaje na účely spracúvania, ale potrebujete ich vy na preukázanie, uplatňovanie alebo obhajovanie právnych nárokov;</li>
						<li>ste namietali voči spracúvaniu Vašich osobných údajov z dôvodov uvedených v bode 1. vyššie, a to až do overenia, či oprávnené dôvody na strane prevádzkovateľa prevažujú nad oprávnenými dôvodmi dotknutej osoby.</li>
					</ul>

					<h4>6. Právo na prenosnosť údajov</h4>
					<p>Máte právo získať osobné údaje, ktoré sa Vás týkajú a ktoré ste nám poskytli v štruktúrovanom, bežne používanom a strojovo čitateľnom formáte a máte právo preniesť tieto údaje ďalšiemu prevádzkovateľovi bez toho, aby sme Vám v tom bránili, ak:</p>
					<ul>
						<li>je spracúvanie osobných údajov založené na Vašom súhlase alebo na zmluve;</li>
						<li>ak sa spracúvanie vykonáva automatizovanými prostriedkami.</li>
					</ul>

					<h4>7. Právo podať sťažnosť dozornému orgánu</h4>
					<p>V prípade, ak sa domnievate, že došlo k porušeniu Vašich práv pri spracúvaní osobných údajov alebo k porušeniu všeobecne záväzných právnych predpisov v oblasti ochrany osobných údajov, máte právo obrátiť sa na Úrad na ochranu osobných údajov Slovenskej republiky s návrhom na začatie konania o ochrane osobných údajov podľa § 99 Zákona o ochrane osobných údajov.</p>

					<p>Všetky svoje práva si môžete uplatniť kontaktovaním kontaktnej osoby uvedenej v tejto Informácii o spracúvaní osobných údajov, písomne, vrátane e-mailu, a tiež zákonom ustanoveným postupom adresovaným dozornému orgánu, ktorým je Úrad na ochranu osobných údajov Slovenskej republiky, Hraničná 12, 820 07 Bratislava, tel.: + 421 2 32 31 32 14, e-mail: <a href="mailto:statny.dozor@pdp.gov.sk">statny.dozor@pdp.gov.sk</a>, webstránka: <a href="http://www.dataprotection.gov.sk/" target="_blank">http://www.dataprotection.gov.sk/</a>.</p>

					<p>Vaša žiadosť môže byť zamietnutá v prípadoch dovolených alebo ustanovených zákonom.</p>

					<h4>ZMENA INFORMÁCIE O OCHRANE OSOBNÝCH ÚDAJOV</h4>

					<p>Túto Informáciu o spracúvaní osobných údajov môžeme niekedy zmeniť alebo doplniť. Taká zmena alebo doplnenie sa nijakým spôsobom bez Vášho výslovného súhlasu nedotkne Vašich práv, ktoré Vám vyplývajú z príslušných všeobecne záväzných právnych predpisov o ochrane osobných údajov.</p>
				</div>
			</Row>
		</Layout>
	);
};

export default PrivacyPolicy;
