import React from "react";
import Layout from "../components/layout";
import Row from "../components/row";

const Cookies = ({ pageContext }) => {
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
                    <h2>Informácie o používaní súborov cookie a iných internetových technológií

                    </h2>
                    <div class="contact-info">
                        <p>Prevádzkovateľom tejto webstránky <a href="https://www.nextfestival.sk" target="_blank">www.nextfestival.sk</a> (ďalej len „webstránka") je <strong>ATRAKT ART, občianske združenie</strong>, sídlo: Gallayová 43, 841 02, Bratislava, IČO: 36066273 (ďalej ako „naša organizácia" alebo „my").</p>
                    </div>

                    <div class="section">
                        <p>V týchto informáciách o používaní súborov cookie a iných internetových technológií uvádzame spôsob zhromažďovania a spracúvania údajov v súvislosti s návštevou alebo užívaním týchto webstránok, t. j. pomocou internetových technológií, ďalej špecifikáciu internetových technológií, ktoré webstránka používa, ktoré údaje v súvislosti s návštevou alebo užívaním webstránky spracúvame a na aký účel spracúvame tieto údaje.</p>

                        <p>Obsah tejto webstránky slúži najmä na informačné účely a vo všeobecnosti nezhromažďujeme ani nespracúvame v súvislosti s jej užívaním a prehliadaním žiadne osobné údaje, ktoré by ťa priamo či nepriamo identifikovali, a to automaticky ani iným spôsobom.</p>

                        <p>V súvislosti s tvojou návštevou alebo používaním webstránky spracúvame tvoje údaje najmä na nasledovné účely: zabezpečenie základnej funkcionality webstránky, sledovanie návštevnosti webstránky a štatistické účely.</p>
                    </div>

                    <h4>Čo sú súbory cookie?</h4>

                    <p>V prípade, ak navštíviš našu webstránku, do tvojho počítača môžeme umiestniť informácie, ktoré nám umožňujú rozpoznať tvoj počítač. Tieto informácie sú bežne známe ako "cookie". Cookie je malý súbor písmen a čísel, ktoré ukladáme v tvojom prehliadači alebo na pevnom disku tvojho počítača, ak s tým vyjadríš svoj súhlas. Súbory cookie umožňujú zhromažďovanie určitých informácií týkajúcich sa tvojho počítača a pomáhajú nám tiež zhromažďovať štatistické a analytické informácie o používaní tejto stránky a správaní užívateľa.</p>

                    <p>Prostredníctvom našej webstránky zhromažďujeme informácie o navštívení, prehliadaní a návštevnosti webstránky, tieto informácie sú však anonymizované a preto nedochádza k spracúvaniu žiadnych tvojich osobných údajov. Ukladá sa iba jedinečný identifikátor relácie, ktorý nám umožňuje opätovne načítať profil a predvoľby užívateľa pri tvojej ďalšej návšteve tejto webovej stránky.</p>

                    <h4>Súhlas s používaním súborov cookie</h4>

                    <p>Každý užívateľ prezeraním tejto webovej stránky súhlasí s používaním súborov cookie a ich ukladaním do svojho prehliadača. O tejto skutočnosti ste upozornení pri návšteve tejto webovej stránky a svoj súhlas prejavujete ďalším prezeraním tejto webovej stránky. Ak ako užívateľ nesúhlasíš s používaním súborov cookie, túto webovú stránku nenavštevuj alebo súbory cookie aktívne vymaž alebo zablokuj.</p>

                    <p>Ak zablokuješ používanie súborov cookie, túto stránku budeš môcť naďalej navštíviť, niektoré funkcie však nemusia fungovať správne. Súbory cookie, ktoré sa na webstránke používajú, si môžeš nastaviť vo svojom webovom prehliadači.</p>

                    <h4>Ako spravovať súbory cookie</h4>

                    <p>Väčšina internetových prehliadačov je prednastavená na automatické akceptovanie cookie. Vždy máš právo zakázať používanie súborov cookie využitím nastavenia v prehliadači, ktoré ti umožňuje odmietnuť nastavenie všetkých alebo niektorých súborov cookie, prípadne byť upozornený/á v prípade, keď sa majú súbory cookies poslať do tvojho zariadenia.</p>

                    <p>Inštrukcie na zmenu používania súborov cookie nájdeš v nastaveniach či v sekcii zameranej na pomoc užívateľom v každom prehliadači. V prípade, ak používaš viaceré zariadenia (počítač, smartphone, tablet), odporúčame ti prispôsobiť používanie súborov cookie podľa tvojich preferencií v každom z prehliadačov.</p>

                    <h4>Typy používaných súborov cookie</h4>

                    <div class="cookie-type">
                        <h4>Základné/nevyhnutné súbory cookie</h4>
                        <p>Ide o súbory cookie nevyhnutné pre prevádzku webstránky a pre poskytovanie našich služieb a neobsahujú informácie, ktoré by mohli návštevníkov priamo identifikovať. Zabezpečujú tiež napríklad funkčnosť zmeny z http na https a tým aj dodržiavanie zvýšených bezpečnostných požiadaviek na prenos údajov a takéto súbory cookie tiež ukladajú tvoje rozhodnutie, pokiaľ ide o používanie súborov cookie na webstránke. V prípade, ak tieto súbory cookie nepovolíš, nemôžeme ti zaručiť používanie obsahu webstránky.</p>
                    </div>

                    <div class="cookie-type">
                        <h4>Analytické/prevádzkové súbory cookie</h4>
                        <p>Zhromažďujú informácie o tom, akým spôsobom návštevníci webstránku používajú, umožňujú rozpoznať a spočítať počet návštevníkov a vidieť, ako sa návštevníci pohybujú na webstránke pri jej používaní. Takýmto spôsobom zlepšujeme fungovanie našich služieb, napríklad zabezpečením toho, že používatelia ľahko nájdu to, čo hľadajú. Nezhromažďujeme informácie, ktoré by mohli návštevníkov priamo identifikovať. Údaje sú súhrnné a anonymné.</p>
                    </div>

                    <div class="cookie-type">
                        <h4>Súbory cookie tretích strán</h4>
                        <p>Tretie strany (napríklad služby analýzy webových návštev) môžu tiež používať súbory cookie, nad ukladaním ktorých nemáme žiadnu kontrolu. Tieto súbory cookie sú pravdepodobne analytické/výkonné alebo cielené súbory cookie. Môže ísť o prípad, keď prezeraná webová stránka používa nástroj na analýzu alebo marketingovú automatizáciu od tretej strany (napr. Google Analytics). To má za následok prijatie súborov cookie od týchto služieb tretích strán.</p>

                        <p>Pre viac informácií o používaní týchto súborov cookie navštív webové stránky príslušných tretích strán. V prípade, ak si sa rozhodol/a, že vo všeobecnosti nebudeš súhlasiť s používaním súborov cookie (ktorých používanie vyžaduje tvoj súhlas, viď nižšie), alebo odvoláš súhlas, ktorý si predtým poskytol/a, budú ti sprístupnené len tie funkcie webstránky, pri ktorých môžeme zaručiť ich používanie bez týchto súborov cookie.</p>

                        <p>Tie časti webstránky, ktoré potenciálne ponúkajú technickú možnosť integrovať obsah tretích strán, a na tento účel nastaviť/používať súbory cookie tretích strán, ti v tomto prípade nebudú sprístupnené. Ak napriek tomu chceš používať príslušný obsah webstránky, je to možné len vtedy, ak poskytneš svoj súhlas s používaním takýchto súborov cookie, a to prostredníctvom odkazu, ktorý je umiestnený na webstránke v príslušnej sekcii.</p>
                    </div>

                    <h4>Prehľad používaných nástrojov a súborov cookie</h4>

                    <table>
                        <thead>
                            <tr>
                                <th>Nástroj</th>
                                <th>Poznámka</th>
                                <th>Doba uchovávania údajov</th>
                                <th>Typ cookie</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Google Analytics</strong><br/>(účel: analytika), typ b</td>
                                <td>Žiadne osobné údaje, Potrebná informácia<br/><a href="https://tools.google.com/dlpage/gaoptout" target="_blank">https://tools.google.com/dlpage/gaoptout</a></td>
                                <td>50 mesiacov</td>
                                <td>Štatistické</td>
                            </tr>
                            <tr>
                                <td><strong>Google Ads</strong><br/>(remarketing), typ c</td>
                                <td>Žiadne osobné údaje, Potrebná informácia<br/><a href="http://adssettings.google.com/" target="_blank">http://adssettings.google.com/</a></td>
                                <td>540 dní</td>
                                <td>Remarketing</td>
                            </tr>
                            <tr>
                                <td><strong>Facebook Ads</strong><br/>(remarketing), typ c</td>
                                <td>Žiadne osobné údaje, Potrebná informácia<br/><a href="https://www.facebook.com/ads/preferences/" target="_blank">https://www.facebook.com/ads/preferences/</a></td>
                                <td>max. 90 dní</td>
                                <td>Remarketing</td>
                            </tr>
                            <tr>
                                <td><strong>Interné cookies</strong></td>
                                <td>Žiadne osobné údaje</td>
                                <td>24 hodín</td>
                                <td>Nevyhnutné</td>
                            </tr>
                        </tbody>
                    </table>

                    <h4>Sprístupnenie údajov tretím stranám</h4>

                    <p>V odôvodnených prípadoch môžeme údaje získané prostredníctvom webstránky sprístupniť tretím stranám, a to najmä poskytovateľom analytických a štatistických služieb.</p>

                    <p>Používanie webstránky je analyzované využitím súborov cookie pomocou nástroja Google Analytics poskytovaného spoločnosťou Google, Inc. (ďalej len „Google"). Podrobnejšie informácie o spracúvaní údajov v súvislosti s využívaním súborov cookie nástrojmi Google nájdeš na internetovej stránke Google.</p>

                    <p>Ako je uvedené vyššie, máš kedykoľvek právo zakázať resp. odvolať svoj súhlas s používaním súborov cookie na webstránke alebo vo svojom prehliadači. Ak to však urobíš pre všetky typy súborov cookie, nebudeš môcť využívať všetky funkcie webstránky.</p>

                    <p>Za účelom splnenia našej zákonnej povinnosti môžeme údaje poskytnúť orgánom verejnej moci, najmä súdom a iným orgánom činným v trestnom konaní, ako aj iným orgánom verejnej správy.</p>

                    <h4>Doba uchovávania údajov</h4>

                    <p>Doba uchovávania údajov v súvislosti s používaním webstránky sa líši v závislosti od príslušného typu používaných súborov cookie. Údaje v súvislosti s používaním súborov cookie, ktoré sú nevyhnutné na prevádzku webstránky sa uchovávajú len po dobu trvania návštevy/používania webstránky. Osobné údaje spracúvané v súvislosti s používaním súborov cookie, ktoré sa využívajú na analytické a štatistické účely, uchovávané na odôvodnene krátke obdobie, najviac po dobu šiestich mesiacov od Vašej poslednej návštevy webstránky.</p>

                    <h4>Webové stránky tretích strán</h4>

                    <p>V prípade, ak webstránka obsahuje odkazy na webové stránky našich partnerov a spriaznených spoločností, vezmi, prosím, na vedomie, že tieto webové stránky sú oddelené od našej webstránky a majú vlastné pravidlá ochrany osobných údajov, vyhlásenia o ochrane osobných údajov, o používaní súborov cookie alebo iné podobné oznámenia.</p>

                    <p>Naša organizácia žiadnym spôsobom nezodpovedá za obsah týchto webstránok ani za uplatňovanie či absenciu uplatňovania pravidiel osobných údajov týkajúce sa ich použitia. Odporúčame ti pred používaním týchto webstránok oboznámiť sa s pravidlami, ktoré sa k nim vzťahujú.</p>

                </div>
            </Row>
        </Layout>
    );
};

export default Cookies;
