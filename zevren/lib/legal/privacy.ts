import type { LegalContent } from "@/lib/legal/types";

export const PRIVACY: LegalContent = {
  en: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    updated: "Last updated: 19 August 2026",
    metaTitle: "Privacy Policy",
    metaDescription:
      "How ZEVREN handles personal data, in line with the GDPR.",
    blocks: [
      {
        type: "p",
        text: "{company} (ZEVREN, we, us), based in {city}, the Netherlands, is responsible for the processing of personal data as described in this privacy policy. We comply with the EU General Data Protection Regulation (GDPR).",
      },
      { type: "h2", text: "What data we process" },
      {
        type: "p",
        text: "When you fill in the contact form on this website, we process the data you provide yourself: your name, email address, optionally your company name, and the content of your message. We don't collect any data through the form beyond what you enter.",
      },
      { type: "h2", text: "Why we process this data" },
      {
        type: "p",
        text: "We use this data solely to respond to your enquiry and, if it leads to an engagement, to carry out the agreement with you. The legal basis for this is Article 6(1)(b) GDPR (performance of a contract or steps taken prior to entering into a contract) and, where applicable, our legitimate interest in answering enquiries from prospective clients.",
      },
      { type: "h2", text: "Retention period" },
      {
        type: "p",
        text: "We keep contact form data for a maximum of 24 months after the last point of contact, unless it leads to an agreement. In that case we keep data for as long as necessary to perform the agreement, plus any statutory retention periods that follow, such as the 7 year retention obligation for financial records under Dutch tax law.",
      },
      { type: "h2", text: "Sharing with third parties" },
      {
        type: "p",
        text: "We don't sell personal data to third parties. We use a limited number of processors to operate this website and our services, such as our hosting provider (Vercel) and an email service for handling form submissions (Resend). Data processing agreements are in place with these parties wherever the GDPR requires one.",
      },
      { type: "h2", text: "Cookies and visitor statistics" },
      {
        type: "p",
        text: "This website doesn't use tracking cookies. No advertising or profiling cookies are placed. The only cookie we set stores the language you picked, so the site opens in that language on your next visit.",
      },
      {
        type: "p",
        text: "To see how many people visit the site and which pages they read, we use Vercel Web Analytics. It works without cookies and without a device fingerprint: no visitor is identified or followed across websites, and the data cannot be traced back to you. If we ever switch to a method that does require consent, we'll update this policy and ask for it first.",
      },
      { type: "h2", text: "Security" },
      {
        type: "p",
        text: "We take appropriate technical and organisational measures to protect personal data against loss or unlawful processing, including encrypted connections (HTTPS), restricted access to data, and up-to-date security patches for the systems we use.",
      },
      { type: "h2", text: "Your rights" },
      {
        type: "p",
        text: "You have the right to access, correct or have your personal data deleted. You can also object to the processing of your data or ask us to restrict it. To do so, contact us at {email}. You also have the right to lodge a complaint with the Dutch Data Protection Authority (Autoriteit Persoonsgegevens).",
      },
      { type: "h2", text: "Changes" },
      {
        type: "p",
        text: "We may update this privacy policy from time to time. The most current version is always available on this page.",
      },
      { type: "h2", text: "Contact" },
      {
        type: "p",
        text: "Questions about this privacy policy? Reach out via {email} or {phone}.",
      },
    ],
  },

  nl: {
    eyebrow: "Juridisch",
    title: "Privacyverklaring",
    updated: "Laatst bijgewerkt: 19 augustus 2026",
    metaTitle: "Privacyverklaring",
    metaDescription:
      "Hoe ZEVREN omgaat met persoonsgegevens, in lijn met de AVG.",
    blocks: [
      {
        type: "p",
        text: "{company} (ZEVREN, wij, ons), gevestigd in {city}, Nederland, is verantwoordelijk voor de verwerking van persoonsgegevens zoals beschreven in deze privacyverklaring. Wij houden ons aan de Algemene verordening gegevensbescherming (AVG).",
      },
      { type: "h2", text: "Welke gegevens wij verwerken" },
      {
        type: "p",
        text: "Als je het contactformulier op deze website invult, verwerken wij de gegevens die je zelf opgeeft: je naam, e-mailadres, eventueel je bedrijfsnaam en de inhoud van je bericht. Via het formulier verzamelen wij niets meer dan wat je zelf invult.",
      },
      { type: "h2", text: "Waarom wij deze gegevens verwerken" },
      {
        type: "p",
        text: "Wij gebruiken deze gegevens uitsluitend om op je vraag te reageren en, als daar een opdracht uit voortkomt, om de overeenkomst met je uit te voeren. De grondslag hiervoor is artikel 6 lid 1 sub b AVG (uitvoering van een overeenkomst of stappen voorafgaand daaraan) en, waar van toepassing, ons gerechtvaardigd belang om vragen van mogelijke opdrachtgevers te beantwoorden.",
      },
      { type: "h2", text: "Bewaartermijn" },
      {
        type: "p",
        text: "Gegevens uit het contactformulier bewaren wij maximaal 24 maanden na het laatste contactmoment, tenzij er een overeenkomst uit voortkomt. In dat geval bewaren wij de gegevens zolang dat nodig is voor de uitvoering van de overeenkomst, plus de wettelijke bewaartermijnen die daarop volgen, zoals de fiscale bewaarplicht van 7 jaar voor administratie.",
      },
      { type: "h2", text: "Delen met derden" },
      {
        type: "p",
        text: "Wij verkopen geen persoonsgegevens aan derden. Voor het draaien van deze website en onze diensten gebruiken wij een beperkt aantal verwerkers, zoals onze hostingpartij (Vercel) en een e-maildienst voor het afhandelen van formulierinzendingen (Resend). Met deze partijen zijn verwerkersovereenkomsten gesloten waar de AVG dat vereist.",
      },
      { type: "h2", text: "Cookies en bezoekersstatistieken" },
      {
        type: "p",
        text: "Deze website gebruikt geen trackingcookies. Er worden geen advertentie- of profileringscookies geplaatst. De enige cookie die wij plaatsen onthoudt de taal die je hebt gekozen, zodat de site de volgende keer in die taal opent.",
      },
      {
        type: "p",
        text: "Om te zien hoeveel mensen de site bezoeken en welke pagina's zij lezen, gebruiken wij Vercel Web Analytics. Dat werkt zonder cookies en zonder apparaatvingerafdruk: geen enkele bezoeker wordt geïdentificeerd of over websites heen gevolgd, en de gegevens zijn niet naar jou te herleiden. Mochten wij ooit overstappen op een methode die wél toestemming vereist, dan passen wij deze verklaring aan en vragen wij die toestemming eerst.",
      },
      { type: "h2", text: "Beveiliging" },
      {
        type: "p",
        text: "Wij nemen passende technische en organisatorische maatregelen om persoonsgegevens te beschermen tegen verlies of onrechtmatige verwerking, waaronder versleutelde verbindingen (HTTPS), beperkte toegang tot gegevens en actuele beveiligingsupdates voor de systemen die wij gebruiken.",
      },
      { type: "h2", text: "Jouw rechten" },
      {
        type: "p",
        text: "Je hebt het recht je persoonsgegevens in te zien, te corrigeren of te laten verwijderen. Ook kun je bezwaar maken tegen de verwerking of ons vragen die te beperken. Neem daarvoor contact op via {email}. Daarnaast heb je het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens.",
      },
      { type: "h2", text: "Wijzigingen" },
      {
        type: "p",
        text: "Wij kunnen deze privacyverklaring van tijd tot tijd aanpassen. De meest actuele versie staat altijd op deze pagina.",
      },
      { type: "h2", text: "Contact" },
      {
        type: "p",
        text: "Vragen over deze privacyverklaring? Neem contact op via {email} of {phone}.",
      },
    ],
  },

  de: {
    eyebrow: "Rechtliches",
    title: "Datenschutzerklärung",
    updated: "Zuletzt aktualisiert: 19. August 2026",
    metaTitle: "Datenschutzerklärung",
    metaDescription:
      "Wie ZEVREN mit personenbezogenen Daten umgeht, im Einklang mit der DSGVO.",
    blocks: [
      {
        type: "p",
        text: "{company} (ZEVREN, wir, uns), ansässig in {city}, Niederlande, ist für die Verarbeitung personenbezogener Daten verantwortlich, wie in dieser Datenschutzerklärung beschrieben. Wir halten uns an die Datenschutz-Grundverordnung (DSGVO).",
      },
      { type: "h2", text: "Welche Daten wir verarbeiten" },
      {
        type: "p",
        text: "Wenn Sie das Kontaktformular auf dieser Website ausfüllen, verarbeiten wir die Daten, die Sie selbst angeben: Ihren Namen, Ihre E-Mail-Adresse, optional Ihren Firmennamen und den Inhalt Ihrer Nachricht. Über das Formular erheben wir nichts darüber hinaus.",
      },
      { type: "h2", text: "Warum wir diese Daten verarbeiten" },
      {
        type: "p",
        text: "Wir verwenden diese Daten ausschließlich, um auf Ihre Anfrage zu antworten und, falls daraus ein Auftrag entsteht, um den Vertrag mit Ihnen zu erfüllen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Erfüllung eines Vertrags oder vorvertragliche Maßnahmen) sowie, soweit einschlägig, unser berechtigtes Interesse an der Beantwortung von Anfragen möglicher Auftraggeber.",
      },
      { type: "h2", text: "Speicherdauer" },
      {
        type: "p",
        text: "Daten aus dem Kontaktformular bewahren wir höchstens 24 Monate nach dem letzten Kontakt auf, sofern daraus kein Vertrag entsteht. In diesem Fall bewahren wir die Daten so lange auf, wie es für die Vertragserfüllung erforderlich ist, zuzüglich der anschließenden gesetzlichen Aufbewahrungsfristen, etwa der siebenjährigen steuerrechtlichen Aufbewahrungspflicht in den Niederlanden.",
      },
      { type: "h2", text: "Weitergabe an Dritte" },
      {
        type: "p",
        text: "Wir verkaufen keine personenbezogenen Daten an Dritte. Für den Betrieb dieser Website und unserer Dienste setzen wir eine begrenzte Zahl von Auftragsverarbeitern ein, etwa unseren Hosting-Anbieter (Vercel) und einen E-Mail-Dienst für die Bearbeitung von Formularübermittlungen (Resend). Mit diesen Parteien bestehen Auftragsverarbeitungsverträge, wo die DSGVO dies verlangt.",
      },
      { type: "h2", text: "Cookies und Besucherstatistiken" },
      {
        type: "p",
        text: "Diese Website verwendet keine Tracking-Cookies. Es werden keine Werbe- oder Profiling-Cookies gesetzt. Das einzige Cookie, das wir setzen, speichert die von Ihnen gewählte Sprache, damit die Website beim nächsten Besuch in dieser Sprache öffnet.",
      },
      {
        type: "p",
        text: "Um zu sehen, wie viele Menschen die Website besuchen und welche Seiten sie lesen, verwenden wir Vercel Web Analytics. Das funktioniert ohne Cookies und ohne Geräte-Fingerabdruck: Kein Besucher wird identifiziert oder websiteübergreifend verfolgt, und die Daten lassen sich nicht auf Sie zurückführen. Sollten wir jemals auf ein Verfahren umstellen, das eine Einwilligung erfordert, aktualisieren wir diese Erklärung und holen die Einwilligung vorher ein.",
      },
      { type: "h2", text: "Sicherheit" },
      {
        type: "p",
        text: "Wir treffen angemessene technische und organisatorische Maßnahmen, um personenbezogene Daten vor Verlust oder unrechtmäßiger Verarbeitung zu schützen, darunter verschlüsselte Verbindungen (HTTPS), beschränkter Zugriff auf Daten und aktuelle Sicherheitsupdates für die von uns eingesetzten Systeme.",
      },
      { type: "h2", text: "Ihre Rechte" },
      {
        type: "p",
        text: "Sie haben das Recht auf Auskunft, Berichtigung und Löschung Ihrer personenbezogenen Daten. Sie können der Verarbeitung außerdem widersprechen oder deren Einschränkung verlangen. Wenden Sie sich dafür an {email}. Darüber hinaus haben Sie das Recht, eine Beschwerde bei der niederländischen Datenschutzbehörde (Autoriteit Persoonsgegevens) einzureichen.",
      },
      { type: "h2", text: "Änderungen" },
      {
        type: "p",
        text: "Wir können diese Datenschutzerklärung von Zeit zu Zeit anpassen. Die jeweils aktuelle Fassung finden Sie stets auf dieser Seite.",
      },
      { type: "h2", text: "Kontakt" },
      {
        type: "p",
        text: "Fragen zu dieser Datenschutzerklärung? Melden Sie sich unter {email} oder {phone}.",
      },
    ],
  },

  fr: {
    eyebrow: "Mentions légales",
    title: "Politique de confidentialité",
    updated: "Dernière mise à jour : 19 août 2026",
    metaTitle: "Politique de confidentialité",
    metaDescription:
      "Comment ZEVREN traite les données personnelles, conformément au RGPD.",
    blocks: [
      {
        type: "p",
        text: "{company} (ZEVREN, nous), établie à {city}, aux Pays-Bas, est responsable du traitement des données personnelles décrit dans la présente politique de confidentialité. Nous respectons le Règlement général sur la protection des données (RGPD).",
      },
      { type: "h2", text: "Quelles données nous traitons" },
      {
        type: "p",
        text: "Lorsque vous remplissez le formulaire de contact de ce site, nous traitons les données que vous fournissez vous-même : votre nom, votre adresse e-mail, éventuellement le nom de votre entreprise et le contenu de votre message. Le formulaire ne collecte rien d'autre que ce que vous saisissez.",
      },
      { type: "h2", text: "Pourquoi nous traitons ces données" },
      {
        type: "p",
        text: "Nous utilisons ces données uniquement pour répondre à votre demande et, si elle débouche sur une mission, pour exécuter le contrat conclu avec vous. La base légale est l'article 6, paragraphe 1, point b, du RGPD (exécution d'un contrat ou mesures précontractuelles) et, le cas échéant, notre intérêt légitime à répondre aux demandes de clients potentiels.",
      },
      { type: "h2", text: "Durée de conservation" },
      {
        type: "p",
        text: "Nous conservons les données du formulaire de contact pendant 24 mois au maximum après le dernier contact, sauf si un contrat en découle. Dans ce cas, nous les conservons aussi longtemps que nécessaire à l'exécution du contrat, ainsi que pendant les durées légales qui s'y ajoutent, comme l'obligation néerlandaise de conservation des documents comptables pendant 7 ans.",
      },
      { type: "h2", text: "Partage avec des tiers" },
      {
        type: "p",
        text: "Nous ne vendons aucune donnée personnelle à des tiers. Pour faire fonctionner ce site et nos services, nous faisons appel à un nombre limité de sous-traitants, comme notre hébergeur (Vercel) et un service d'e-mail pour le traitement des envois de formulaires (Resend). Des accords de sous-traitance sont conclus avec ces parties partout où le RGPD l'exige.",
      },
      { type: "h2", text: "Cookies et statistiques de visite" },
      {
        type: "p",
        text: "Ce site n'utilise pas de cookies de suivi. Aucun cookie publicitaire ou de profilage n'est déposé. Le seul cookie que nous déposons mémorise la langue que vous avez choisie, afin que le site s'ouvre dans cette langue lors de votre prochaine visite.",
      },
      {
        type: "p",
        text: "Pour savoir combien de personnes visitent le site et quelles pages elles consultent, nous utilisons Vercel Web Analytics. Cet outil fonctionne sans cookies et sans empreinte d'appareil : aucun visiteur n'est identifié ni suivi d'un site à l'autre, et les données ne peuvent pas remonter jusqu'à vous. Si nous passions un jour à une méthode nécessitant un consentement, nous mettrions cette politique à jour et le demanderions au préalable.",
      },
      { type: "h2", text: "Sécurité" },
      {
        type: "p",
        text: "Nous prenons des mesures techniques et organisationnelles appropriées pour protéger les données personnelles contre la perte ou un traitement illicite, notamment des connexions chiffrées (HTTPS), un accès restreint aux données et des correctifs de sécurité à jour pour les systèmes que nous utilisons.",
      },
      { type: "h2", text: "Vos droits" },
      {
        type: "p",
        text: "Vous avez le droit d'accéder à vos données personnelles, de les rectifier ou d'en demander l'effacement. Vous pouvez également vous opposer au traitement ou en demander la limitation. Pour cela, contactez-nous à {email}. Vous avez par ailleurs le droit d'introduire une réclamation auprès de l'autorité néerlandaise de protection des données (Autoriteit Persoonsgegevens).",
      },
      { type: "h2", text: "Modifications" },
      {
        type: "p",
        text: "Nous pouvons adapter cette politique de confidentialité de temps à autre. La version la plus récente est toujours disponible sur cette page.",
      },
      { type: "h2", text: "Contact" },
      {
        type: "p",
        text: "Des questions sur cette politique de confidentialité ? Écrivez-nous à {email} ou appelez le {phone}.",
      },
    ],
  },

  es: {
    eyebrow: "Legal",
    title: "Política de privacidad",
    updated: "Última actualización: 19 de agosto de 2026",
    metaTitle: "Política de privacidad",
    metaDescription:
      "Cómo trata ZEVREN los datos personales, conforme al RGPD.",
    blocks: [
      {
        type: "p",
        text: "{company} (ZEVREN, nosotros), con sede en {city}, Países Bajos, es responsable del tratamiento de datos personales descrito en esta política de privacidad. Cumplimos con el Reglamento General de Protección de Datos (RGPD).",
      },
      { type: "h2", text: "Qué datos tratamos" },
      {
        type: "p",
        text: "Cuando rellenas el formulario de contacto de esta web, tratamos los datos que facilitas tú mismo: tu nombre, tu correo electrónico, opcionalmente el nombre de tu empresa y el contenido de tu mensaje. A través del formulario no recogemos nada más allá de lo que escribes.",
      },
      { type: "h2", text: "Por qué tratamos estos datos" },
      {
        type: "p",
        text: "Usamos estos datos únicamente para responder a tu consulta y, si da lugar a un encargo, para ejecutar el contrato contigo. La base jurídica es el artículo 6.1.b del RGPD (ejecución de un contrato o medidas precontractuales) y, cuando proceda, nuestro interés legítimo en responder a las consultas de posibles clientes.",
      },
      { type: "h2", text: "Plazo de conservación" },
      {
        type: "p",
        text: "Conservamos los datos del formulario de contacto un máximo de 24 meses desde el último contacto, salvo que se llegue a un contrato. En ese caso los conservamos el tiempo necesario para ejecutar el contrato, más los plazos legales de conservación posteriores, como la obligación fiscal neerlandesa de conservar la documentación durante 7 años.",
      },
      { type: "h2", text: "Comunicación a terceros" },
      {
        type: "p",
        text: "No vendemos datos personales a terceros. Para operar esta web y nuestros servicios recurrimos a un número limitado de encargados del tratamiento, como nuestro proveedor de alojamiento (Vercel) y un servicio de correo para gestionar los envíos del formulario (Resend). Con estas partes se han firmado contratos de encargo de tratamiento allí donde el RGPD lo exige.",
      },
      { type: "h2", text: "Cookies y estadísticas de visitas" },
      {
        type: "p",
        text: "Esta web no utiliza cookies de seguimiento. No se instalan cookies publicitarias ni de elaboración de perfiles. La única cookie que usamos guarda el idioma que has elegido, para que la web se abra en ese idioma en tu próxima visita.",
      },
      {
        type: "p",
        text: "Para saber cuántas personas visitan la web y qué páginas leen, usamos Vercel Web Analytics. Funciona sin cookies y sin huella del dispositivo: no se identifica a ningún visitante ni se le sigue entre webs, y los datos no pueden asociarse contigo. Si algún día cambiamos a un método que sí requiera consentimiento, actualizaremos esta política y lo pediremos antes.",
      },
      { type: "h2", text: "Seguridad" },
      {
        type: "p",
        text: "Adoptamos medidas técnicas y organizativas adecuadas para proteger los datos personales frente a pérdidas o tratamientos ilícitos, entre ellas conexiones cifradas (HTTPS), acceso restringido a los datos y parches de seguridad actualizados en los sistemas que utilizamos.",
      },
      { type: "h2", text: "Tus derechos" },
      {
        type: "p",
        text: "Tienes derecho a acceder a tus datos personales, rectificarlos o solicitar su supresión. También puedes oponerte al tratamiento o pedir que lo limitemos. Para ello, escríbenos a {email}. Además, tienes derecho a presentar una reclamación ante la autoridad neerlandesa de protección de datos (Autoriteit Persoonsgegevens).",
      },
      { type: "h2", text: "Cambios" },
      {
        type: "p",
        text: "Podemos actualizar esta política de privacidad de vez en cuando. La versión más reciente está siempre disponible en esta página.",
      },
      { type: "h2", text: "Contacto" },
      {
        type: "p",
        text: "¿Preguntas sobre esta política de privacidad? Escríbenos a {email} o llama al {phone}.",
      },
    ],
  },

  ar: {
    eyebrow: "قانوني",
    title: "سياسة الخصوصية",
    updated: "آخر تحديث: 19 آب 2026",
    metaTitle: "سياسة الخصوصية",
    metaDescription: "كيف بتتعامل ZEVREN مع البيانات الشخصية، بما يتوافق مع الـGDPR.",
    blocks: [
      {
        type: "p",
        text: "{company} (ZEVREN، نحن)، ومقرها {city} بهولندا، مسؤولة عن معالجة البيانات الشخصية بالشكل الموصوف بهي السياسة. نحنا ملتزمين باللائحة الأوروبية العامة لحماية البيانات (GDPR).",
      },
      { type: "h2", text: "شو البيانات اللي منعالجها" },
      {
        type: "p",
        text: "لما تعبّي نموذج التواصل بهاد الموقع، منعالج البيانات اللي بتعطيها أنت: اسمك، إيميلك، واختيارياً اسم شركتك، ومحتوى رسالتك. ما منجمّع من النموذج أي شي غير اللي بتكتبه بإيدك.",
      },
      { type: "h2", text: "ليش منعالج هي البيانات" },
      {
        type: "p",
        text: "منستخدم هي البيانات بس للرد ع استفسارك، وإذا طلع منه مشروع، لتنفيذ الاتفاقية معك. الأساس القانوني هو المادة 6(1)(ب) من الـGDPR (تنفيذ عقد أو خطوات قبل إبرامه)، وعند الاقتضاء مصلحتنا المشروعة بالرد ع استفسارات العملاء المحتملين.",
      },
      { type: "h2", text: "مدة الاحتفاظ" },
      {
        type: "p",
        text: "منحتفظ ببيانات نموذج التواصل لمدة أقصاها 24 شهر من آخر تواصل، إلا إذا طلع منها اتفاقية. بهي الحالة منحتفظ فيها للمدة اللازمة لتنفيذ الاتفاقية، زائد مدد الاحتفاظ القانونية اللي بتلحقها، متل الالتزام الضريبي الهولندي بحفظ السجلات المالية لسبع سنين.",
      },
      { type: "h2", text: "المشاركة مع أطراف تالتة" },
      {
        type: "p",
        text: "ما منبيع بيانات شخصية لأي طرف تالت. لتشغيل هاد الموقع وخدماتنا منستعين بعدد محدود من معالجي البيانات، متل مزوّد الاستضافة (Vercel) وخدمة إيميل لمعالجة رسائل النموذج (Resend). وفي اتفاقيات معالجة بيانات مبرمة مع هالأطراف حيثما بيتطلب الـGDPR هيك.",
      },
      { type: "h2", text: "الكوكيز وإحصاءات الزوار" },
      {
        type: "p",
        text: "هاد الموقع ما بيستخدم كوكيز تتبّع. ما منحط كوكيز إعلانية ولا كوكيز تحليل شخصية. الكوكي الوحيد اللي منحطه بيحفظ اللغة اللي اخترتها، لحتى يفتح الموقع بنفس اللغة بزيارتك الجاية.",
      },
      {
        type: "p",
        text: "لنعرف كم واحد بيزور الموقع وأي صفحات بيقرأوا، منستخدم Vercel Web Analytics. بيشتغل بلا كوكيز وبلا بصمة جهاز: ما في زائر بينعرف ولا بينتتبّع بين المواقع، والبيانات ما بترجع إلك. وإذا يوماً حوّلنا لطريقة بتحتاج موافقة، منحدّث هي السياسة ومنطلب الموافقة قبل.",
      },
      { type: "h2", text: "الأمان" },
      {
        type: "p",
        text: "مناخد تدابير تقنية وتنظيمية مناسبة لحماية البيانات الشخصية من الضياع أو المعالجة غير المشروعة، منها الاتصالات المشفّرة (HTTPS)، وتقييد الوصول للبيانات، وتحديثات الأمان المستمرة للأنظمة اللي منستخدمها.",
      },
      { type: "h2", text: "حقوقك" },
      {
        type: "p",
        text: "إلك الحق تطّلع ع بياناتك الشخصية أو تصححها أو تطلب حذفها. وكمان فيك تعترض ع المعالجة أو تطلب تقييدها. لهيك تواصل معنا ع {email}. وكمان إلك الحق تقدّم شكوى للهيئة الهولندية لحماية البيانات (Autoriteit Persoonsgegevens).",
      },
      { type: "h2", text: "التعديلات" },
      {
        type: "p",
        text: "ممكن نحدّث هي السياسة من وقت للتاني. النسخة الأحدث بتكون دايماً ع هي الصفحة.",
      },
      { type: "h2", text: "تواصل معنا" },
      {
        type: "p",
        text: "عندك سؤال عن سياسة الخصوصية؟ راسلنا ع {email} أو {phone}.",
      },
    ],
  },
};
