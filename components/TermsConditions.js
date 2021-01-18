import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import * as  theme from '../core/theme'
import { constants } from '../core/constants'

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

export default class TermsConditions extends Component {

    state = {
        accepted: false
    }

    render() {
        return (
            <Modal
                isVisible={this.props.showTerms}
                style={{ maxHeight: constants.ScreenHeight * 0.8, backgroundColor: '#fff', }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={this.props.dowloadPdf}>
                        <MaterialCommunityIcons name='download' size={24} color={theme.colors.primary} style={{ padding: 15 }} />
                        <Text style={[theme.customFontMSsemibold.body, { color: theme.colors.primary }]}>Télécharger</Text>
                    </TouchableOpacity>
                    <MaterialCommunityIcons name='close' size={21} style={{ padding: 15 }} onPress={this.props.toggleTerms} />
                </View>

                <View style={{ marginVertical: 15, paddingHorizontal: 30 }}>
                    <Text style={[theme.customFontMSsemibold.header, { alignSelf: 'center' }]}>CONDITIONS GÉNÉRALES DE</Text>
                    <Text style={[theme.customFontMSsemibold.header, { alignSelf: 'center' }]}>VENTE ET DE TRAVAUX (CGV)</Text>
                </View>

                <ScrollView
                    style={styles.tcContainer}
                    onScroll={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent))
                            this.setState({ accepted: true })
                    }}
                    contentContainerStyle={{ padding: 15, paddingTop: 0 }}>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>Le consommateur ne bénéficie pas d’un droit de rétractation pour un achat en magasin, dans une foire ou dans un salon</Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 1 : Identité du vendeur</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        La Société SYNERGYS (ci-après le Vendeur) est une société à actions simplifiées au capital de 30 000 € dont le siège social se situe au 270 bis rue de la Combe du Meunier, ZAC du Castellas,11100 MONTREDON-DES-CORBIERES, immatriculée au Registre du Commerce et des
                        Sociétés de NARBONNE sous le numéro 849 583 281.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 2 : Dispositions générales</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Toute remise de commande implique l’acceptation sans réserve par l’Acheteur (ci-après dénommé « l’Acheteur » ou « le Client ») et son adhésion pleine et entière aux présentes Conditions Générales de vente (ci-après et ci-dessus dénommées « CGV »). Aucune clause
                        différente ne sera opposable à SYNERGYS à moins qu’elle ne l’ait acceptée expressément.
                        Ces conditions générales de vente sont systématiquement communiquées à tout Client préalablement à la passation de commande, et forme avec le bon commande les documents contractuels opposables au Vendeur et au Clients. Le fait que le Vendeur ne se prévale pas, à
                        un moment donné, de l’une quelconque des clause présente CGV ne peut être interprété comme valant renonciation à se prévaloir ultérieurement de l’une quelconque des dites clauses. Le Client reconnait avoir eu communication, préalablement à la passation de sa commande
                        d’une manière claire et compréhensible des présentes CGV et de toutes les informations te renseignements visés à l’article L111-1 du Code de la Consommation. Toute commande passée auprès de la société SYNERGYS emporte adhésion et acceptation pleine et entière des
                        présentes CGV ce qui est expressément reconnu par le client, qui renonce notamment à se prévaloir de tous documents contradictoires qui serait opposable à la société SYNERGYS. Les présentes CGV pourront faire l’objet de modification ultérieure, la version applicable à
                        l’achat du client est celle en vigueur au jour de la conclusion du contrat.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 3 : Crédit à la consommation</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        En cas de recours par l’acheteur à un crédit à la consommation, la vente est soumise aux articles
                        L 312-41, L 312-56 du code de la consommation ; notamment aux termes de l’article L 312-352.
                        Vente assortis d’un crédit :
                        1) l’acheteur dispose d’un droit de rétraction pour le crédit affecte servant à financer son achat.
                        2) le contrat de vente ou de prestations de services est résolu de pleins droits, sans indemnités, si l’emprunteur dans le délai de 14jours, exerce son droit de rétractation relatifs au crédit affecté dans les conditions prévues à l’article L 312-52 ;
                        3) en cas de résolution du contrat de vente ou de prestations de services consécutives à l’exercice du droit de rétractation pour le crédit affecté, le vendeur ou le prestataire de service est tenu de rembourser, sur simple demande, toute somme que l’acheteur aurait versé
                        d’avance sur le prix. A compter du huitième jour suivant la demande de remboursement, cette somme est productive d’intérêts, de pleins droits, au taux de l’intérêt légal majoré de moitié.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 4 : Commande-Modifications-Indisponibilités des produits</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        4.1 Toute commande doit être confirmé par écrit aux moyens d’un bon de commande SYNERGYS dument signé par le client. Le client reconnait être en possession d’un double de tous les documents qui aurait signé lors de la passation de commande.
                        4.2 Toute modification apportée à la commande confirmée devra intervenir dans les maximums dans les cinq (5) jours calendaires suivant la visite d’un technicien SYNERGYS au lieu où doit être livré le produit où exécutée la prestation de services indiquée sur le bon de
                        commande fera l’objet d’un ajustement du prix soit à la hausse, soit à la baisse.
                        4.3 Si le produit commandé est indisponible à la livraison SYNERGYS en informant immédiatement le client et peut lui proposer un produit d’une qualité et d’un prix équivalents. En cas de désaccord, le client est remboursé au plus tard dans les quatorze (14) jours du paiement
                        des sommes.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 5 : Prix-Conditions de paiement du prix</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le prix s’entend toutes taxes comprises à l’égard des acheteurs personnes physiques. Le montant de la facture sera établi en incluant la TVA au taux en vigueur au jour de la facturation. Le paiement du prix se fait suivant le mode et les conditions indiquées sur le bon de
                        commande et notamment par le versement à SYNERGYS d’un acompte de 30% du prix TTC dès que le délai de quatorze (14) jours après la passation de la commande aura expiré, dans le cas d’un paiement au comptant. Cet acompte ne pourra en aucun cas être qualifié d’arrhes.
                        Le solde devra être versé par le client à réception de la facture. Le client ne peut jamais, sous prétexte de réclamations formulée par lui à l’encontre de SYNERGYS retenir toute ou partie des sommes dues par lui à cette dernière, ni opérer une compensation.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 6 : Autorisations</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client reconnait être informé du fait que les travaux d’installation des produits peuvent nécessiter l’obtention préalable d’une autorisation (autorisation d’urbanisme, autorisation de copropriété, …) ou d’un permis de construire. En conséquence, le client s’engage
                        expressément à faire son affaire personnelle, sauf convention expresse entre les parties, de l’obtention de ladite autorisation ou dudit permis de construire, et à fournir à SYNERGYS les justificatifs nécessaires avant le début des travaux. La non-obtention de ladite autorisation
                        ou dudit permis de construire pour quelques causes que ce soit ne saurait en aucun cas engager la responsabilité de la société SYNERGYS.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 7 : Crédit d’impôt-Aides</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 8 : Livraison-Délai</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 9 : Installation</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 10 : Production d’énergie-Rendement</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 11 : Clauses de réserve de propriété-Transfert des risques</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 12 : Droit de rétraction</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 13 : Garantie</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 14 – Responsabilité du Vendeur-Force majeure-Défaut de sécurité du produit</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 15-Résolution</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 16-Informatiques et libertés</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 17- Droit à l’image</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 18- Propriétés intellectuelles</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 19-Litiges</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text style={[theme.customFontMSsemibold.body, styles.header]}>Article 20- Invalidité partielle</Text>
                    <Text style={[theme.customFontMSregular.body, styles.article]}>
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                    <Text>

                        Article 7 : Crédit d’impôt-Aides
                        Le client est informé qu’il peut exister des aides publiques ou parapubliques et/ou un crédit d’impôt lié à l’acquisition du produit, objet du contrat. Cependant, SYNERGYS ne garantit pas au client l’obtention d’une quelconque aide publique ou parapublique, de même qu’elle
                        ne garantit pas l’obtention ou le montant d’un crédit d’impôt. La non-obtention par le client du crédit d’impôt et/ou de l’aide publique ou parapublique sollicité ne serait constituer une condition suspensive du contrat. En aucun cas, la non-obtention du crédit d’impôt et/ou
                        de l’aide publique ou parapublique sollicité, ne pourra motiver la résolution du contrat, le blocage des fonds du financement par le client ou le non-paiement du solde du prix.
                        Article 8 : Livraison-Délai
                        Le délai de livraison ou d’installation des produits est mentionné sur le bon de commande. Toute modification, à l’initiative du client, de livraison ou d’installation mentionnées sur le bon de commande devra faire l’objet d’une acceptation écrite par SYNERGYS. En pareille
                        hypothèse, ladite modification donnera automatiquement lieu à un report de la date de livraison ou de l’installation initialement prévue. La livraison est réputée effectuée : pour les produits, par le transfert au client ou un tiers désigné par lui-même et autres que le transporteur
                        proposé par le vendeur de la possession physique ou du contrôle du produit : pour les fournitures de prestations de service, après avoir réalisé la mise en place ou le montage des installations. Lorsque le client s’est lui-même chargé de faire appel à un transporteur qu’il a choisi
                        lui-même, la livraison est réputée effectuer lors de la remise des produits commandés par SYNERGYS au transporteur. Dans un tel cas, le client reconnaît donc que c’est au transporteur qu’il appartient d’effectuer la livraison et ne dispose d’aucun recours en garantie contre
                        SYNERGYS en cas de défaut de livraison des marchandises transportées. Les livraisons sont effectuées franco au domicile du client ou à toute autre adresse indiqué par lui si la livraison est assurée par SYNERGYS ou par un transporteur indépendant choisi par SYNERGYS. En cas
                        de demande particulière du client concernant les conditions d’emballage ou du transport des produits commandés, dûment accepter par écrit par SYNERGYS des coûts, y liées feront l’objet d’une facturation spécifique complémentaire sur devis préalablement accepté par écrit
                        par le client. Le client est tenu de vérifier l’état des produits livrés. En cas de détérioration de perte partiel du produit le client dispose d’un délai de trois (3) jours suivant la réception du produit pour formuler par lettre recommandé avec demande d’avis de réception toute
                        réserve aux réclamations au transporteur conformément à l’article L 133-3 du code de commerce. Si les produits commandés n’ont pas été livré dans un délai de trente jours (30) après la date de livraison indiquée sur le bon de commande, pour autre cause que la force majeure
                        ou le fait du client ou le fait insurmontable et imprévisible d’un tiers au contrat, la vente pourra être résolu à la demande écrite du client dans les conditions prévues aux articles L 216-2 et L 216-3 du code de la consommation. Les sommes versées par le client lui seront alors
                        restituées au plus tard dans les quatorze (14) jours qui suivent la date de dénonciation du contrat, à l’exclusion de toute indemnisation ou retenue. Le client doit permettre le libre accès des lieux où doit être livré le bien. Lors de la livraison, l’acheteur ou son représentant
                        (conjoint préposé, mandataire…) doit être présent.
                        Article 9 : Installation
                        L’installation et la mise en service des produits sont effectuées exclusivement par SYNERGYS ou par l’intermédiaire d’un sous-traitant. A cette fin le client s’engage :
                         A laisser aux salariés de la société SYNERGYS ou de son sous-traitant le libre accès du chantier.
                         A mettre à disposition de la société SYNERGYS ou de son sous-traitant la surface du toit ou de façade ainsi que les portes intérieures et/ou extérieures bâtiments où doit être réalisée l’installation.
                         A fournir l’eau et l’électricité nécessaire à l’installation et à la mise en service du matériel.
                         Dans le cas de travaux nécessitant de pénétrer sur des fonds contigus, à faire son affaire personnelle des demandes d’autorisation auprès des propriétaires concernés avant toute intervention de SYNERGYS ou de son sous-traitant.
                         A fournir toute justification sur le passage des canalisations d’eau, de gaz et d’électricité susceptibles de se trouver aux endroits de perçage des murs.
                        Le client déclare expressément que ses installations ou son bâtiment répond aux normes de construction en vigueur au jour de l’installation. En conséquence, le client fera son affaire personnelle de tout renforcement éventuellement nécessaire des structures existantes pour
                        supporter le matériel et l’évolution des personnes de la société SYNERGYS ou de son sous-traitant. Le client autorise expressément SYNERGYS ou son sous-traitant à apporter à ses structures ou bâtiments toute modification nécessitée par l’installation des produits sans pouvoir
                        réclamer aucune somme au vendeur. Le client garantit la conformité de son installation électrique aux normes en vigueur au jour de l’installation.
                        Article 10 : Production d’énergie-Rendement
                        Le client reconnaît être informé que la production d’énergie et le rendement de l’installation dépend de nombreux paramètres et, en conséquence que les informations, sur les économies d’énergies potentielles réalisables, sont fournis par la société SYNERGYS ou par ses
                        représentants à titre purement indicatif et non contractuelles. La société SYNERGYS ne souscrit aucun engagement au titre des économies d’énergies car elle ne serait garantir en aucun cas un volume ou un revenu.
                        Article 11 : Clauses de réserve de propriété-Transfert des risques
                        SYNERGYS se réserve jusqu’au complet paiement du prix par le client, et ce quel que soit la date de livraison et d’installation des produits, un droit de propriété sur les produits vendus lui permettant de reprendre possession du dît produit. Par simple lettre recommandée avec
                        accusé de réception, SYNERGYS pourra exiger la restitution des produits aux frais et risques du client jusqu’au complet paiement du prix. Dans le cas où les produits auraient été installés, le client renonce en cas de non-paiement intégral, à la remise en l’état de ses installations,
                        telles qu’elles étaient avant l’installation des produits mentionnés sur le bon de commande, signé par les deux partis. Tout risque de perte et d’endommagement des produits est transféré au client au moment où ce dernier ou un tiers désigné par lui, et autre que le transporteur
                        proposé par SYNERGYS, prend physiquement possession de ces biens. Lorsque le client confie la livraison du bien à un transporteur autre que celui proposé par notre société, le risque de perte ou d’endommagement du bien est transféré au client à la remise du bien au
                        transporteur.
                        Article 12 : Droit de rétraction
                        12.1 Droit de rétractation pour les contrats à distance ou en dehors d’un établissement commercial :
                        Vous avez le droit de vous rétracter du présent contrat sans donner de motif dans un délai de quatorze jours. Le point de départ du délai de rétractation court à compter du jour :
                         De la conclusion du contrat, pour les contrats de prestation de services,
                         De la réception du bien par le consommateur ou un tiers désigné par lui, pour les contrats de vente de biens et les contrats de prestations de services incluant la livraison de bien.
                        Pour exercer le droit de rétractation, vous devez nous notifier (SYNERGYS 6 rue Henri Becquerel 11200 LEZIGNAN-CORBIERES) votre décision de rétractation du présent contrat au moyen d’une déclaration dénuée d’ambiguïté (par exemple, lettre envoyée par la poste). Vous
                        pouvez utiliser le modèle de formulaire de rétractation mais ce n’est pas obligatoire. Pour que le délai de rétraction soit respecté, il suffit que vous transmettiez votre communication relative à l’exercice du droit de rétractation avant l’expiration du délai de rétractation. En cas
                        de rétractation de votre part du présent contrat, nous vous rembourserons tous les paiements reçus de vous, y compris les frais de livraison au plus tard quatorze jours à compter du jour où nous sommes informés de votre décision de rétractation du présent contrat. Ce
                        remboursement n’occasionnera aucun frais pour vous. Nous récupérons le bien à nos propres frais. Votre responsabilité est engagée qu’à l’égard de la dépréciation du bien résultant de manipulations autres que celles nécessaires pour établir la nature, les caractéristiques et
                        le bon fonctionnement de ce bien. Exception au droit de rétractation Conformément à l’article L221-28 du code la consommation, le client ne peut plus exercer son droit de rétractation pour :
                         Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1er du code de la consommation)
                         Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3e du code de la consommation)
                        12.2 Rétractation hors délais
                        Lorsque le client demande par lettre recommandé avec AR d’annuler sa commande alors qu’aux termes de la loi, elle est réputée ferme et définitive, le client devra régler à la société une indemnité d’annulation de 3000,00 euros. Les acomptes déjà versés seront ainsi retenus
                        à due concurrence et éventuellement complétés. En cas d’annulation par la société, elle s’engage, sauf cas de force majeure, à restituer les acomptes et à indemniser le client par une indemnité égale à 3000,00 euros
                        Une prestation de services commencée avec son accord avant la fin du délai de rétractation et qu’il y a renoncé expressément (L221-28 1° du code de la consommation)
                        Une fourniture de biens confectionnés selon les spécifications du consommateur ou nettement personnalisés (L221-28 3°du code de la consommation).
                        Article 13 : Garantie
                        13.1 Au titre de la garantie légale, le client bénéficie sur les biens meubles corporels, sauf cas d’exonérations envisagés par la loi, de la garantie des vices cachés, prévue par les dispositions des articles 1641 et suivants du Code Civil, et de la garantie de conformité, prévue aux
                        articles L.271-1 et suivants du Code de la consommation. Vous êtes informés que la société SYNERGYS sise 6 rue Henri Becquerel 11200 LEZIGNAN CORBIERES est la garantie de la conformité des Produits au contrat dans le cadre de ces deux garanties légales.
                        Il est rappelé que le consommateur dans le cadre de la garantie légale de conformité :
                        Bénéficie d’un délai de deux ans à compter de la délivrance du bien pour agir ; peut choisir entre la réparation ou le remplacement du bien, sous réserve des conditions de coût prévues par l’article L 217-9 du code de la consommation ; est dispensé de rapporter la preuve de
                        l’existence du défaut de conformité du bien durant les six mois suivant la délivrance du bien.
                        Ce délai est porté à vingt-quatre mois à compter du 18 mars 2016, sauf pour les biens d’occasion. La garantie légale de conformité s’applique indépendamment de la garantie commerciale pouvant couvrir votre bien.
                        Il est rappelé que le consommateur peut décider de mettre en œuvre la garantie contre les défauts cachés de la chose vendue au sens de l’article 1641 du code civil et que dans cette hypothèse il peut choisir entre la résolution de la vente ou une réduction du prix de
                        vente conformément à l’article 1644 du code civil.
                        13.2 Sont exclus de toute garantie, les défectuosités qui résulteraient des cas suivants :
                         Non-respect de la législation du pays dans lequel le produit est livré qu’il appartient au client de vérifier
                         En cas de mauvaise utilisation du produit, d’utilisation anormale ou d’utilisation non conforme aux prescriptions du fabricant, d’utilisation à des fins professionnelles lorsque le client est un non-professionnel, négligence ou défaut d’entretien de la part du
                        client, comme en cas d’usure normale du produit.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un acte de vandalisme.
                         Dégradation, désordre, défaut ou vice du produit et leurs conséquences provenant d’un cas de force majeure ou d’un cas fortuit habituellement reconnu par la jurisprudence ou d’un fait insurmontable et imprévisible d’un tiers.
                         Les pannes ou désordres liés aux accessoires (câble d’alimentation…)
                         Les détériorations, mauvais fonctionnement, défaut ou vice du produit et leurs conséquences provenant directement ou indirectement d’un choc, d’une surtension ou d’une variation du courant électrique, d’un phénomène magnétique.
                         Les défauts, désordre ou vice et leurs conséquences dus à des réparations transformation aux modifications réalisées sur le produit sans l’accord écrit de la société SYNERGYS.
                         Les détériorations, défauts ou vices consécutifs à des phénomènes naturels (chute de grêle, inondation, foudre, tempêtes ou autres aléas atmosphériques) qu’ainsi à des retombées chimiques, animales ou végétales, sable, sel, projection de gravillons et autres
                        facteurs extérieurs.
                        La garantie du vendeur est en tout état de cause limitée au remplacement ou en remboursement des produits non conforme ou affectés d’un vice.
                        Article 14 – Responsabilité du Vendeur-Force majeure-Défaut de sécurité du produit
                        14.1 La responsabilité de la société SYNERGYS est strictement limitée aux obligations définies aux présentes CGV et, le cas échéant, aux conditions particulières résultant d’un écrit signé par SYNERGYS et le client.
                        Toutefois, SYNERGYS ne saurait être tenu pour responsable de tout préjudice n’ayant pas un caractère direct avec les produits livrés ou les travaux effectués (notamment manque-à-gagner, pertes de charges, connexion internet défectueuse, etc…) si ceux-ci ne relèvent pas
                        d’une des garanties à respecter par SYNERGYS.la responsabilité de SYNERGYS ne saurait être engagée si l’inexécution, la mauvaise exécution ou le retard dans l’exécution du contrat est imputable soit au client, soit au fait insurmontable et irrésistible d’un tiers au contrat,
                        soit à un cas de force majeure prévue à l’article 13.2
                        14.2 les parties ne sont pas tenues pour responsables considérés comme ayant failli au titre du présent contrat pour tout retard ou inexécution lorsque la clause du retard est due à de l’inexécution ou au fait insurmontable et imprévisible d’un tiers au contrat. Le cas de force
                        majeure ou le cas fortuit suspend les obligations nées du contrat pendant toute la durée de son existence.
                        14.3 En cas de dommages causés par un défaut de sécurité du produit, l’acheteur doit rechercher la responsabilité du ou des fabricants identifiables à partir des informations mentionnées sur l’emballage (plaque signalétique) du produit.
                        Article 15-Résolution
                        15.1 Résolution à l’initiative du client
                        En cas de livraison d’un produit non conforme aux caractéristiques déclarées du produit, constaté par courrier recommandé avec demande d’avis de réception, ou par écrit sur support durable valant mis en demeure d’y remédier dans les trente (30) jours, le client aura la
                        faculté de notifier à l’issue dudit délai si le manquement subsiste par courrier recommandé avec demande d’avis de réception, sa décision de résoudre le présent contrat. Le contrat est considéré comme résolu à la réception par le vendeur de la lettre ou de l’écrit informant
                        de cette résolution, à moins que le vendeur ne se soit exécuté entre-temps.
                        En cas de livraison du produit de la fourniture du service dépassant le délai limite fixé dans le bon de commande, le client aura faculté de résoudre le présent contrat dans les conditions prévues aux articles L 138-2 et L 138-3 du code de la consommation.
                        Dans ces hypothèses de résolutions le client pourra percevoir une indemnité compensatrice du préjudice subit fixer à 40% du prix TTC sauf si le vendeur justifie d’un montant légitime.
                        15.2 Résolution à l’initiative du vendeur
                        En cas de non-respect de l’une quelconque de ces obligations par le client, la société SYNERGYS pourra se prévaloir de la résolution du contrat sans sommation, ni formalité. Le contrat est considéré comme résolu à la réception par le client de la lettre l’informant de cette
                        résolution, à moins que le client ne soit exécuté entre-temps.
                        La même faculté de résolution est reconnue à SYNERGYS dans le cas où la visite technique par le technicien de la société SYNERGYS au domicile du client n’aura pas pu être réalisée du fait du client dans les deux mois de la signature du contrat.
                        En pareils cas, SYNERGYS pourra reprendre le(s) produit(s) déjà livré(s) et percevoir une indemnité en réparation du préjudice subit sans sommation, ni formalité, indemnité devant être retenue en tout ou partie sur les sommes déjà versées par le client à titre d’acompte.
                        Cette indemnité sera équivalente à 40% du prix TTC de la commande. Toutefois, cette indemnité ne sera pas dû dans le cas où le non-respect de ces obligations par le client est lié à un cas de force majeure où un cas fortuit habituellement reconnu par la jurisprudence ou au
                        fait insurmontable et imprévisible d’un tiers au contrat.
                        Article 16-Informatiques et libertés
                        Les informations collectées par SYNERGYS lors de toute commande du client sont nécessaires pour la gestion de ladite commande par le vendeur. Conformément à la loi informatique 78-17 du 6 janvier 1978, le client dispose d’un droit accès de rectification, d’opposition à
                        communication et de suppression des données le concernant auprès du vendeur. A ce titre, une lettre recommandée avec accusé de réception doit être adressé au siège social de la société SYNERGYS. Le client accepte, sauf proposition de sa part auprès du vendeur de
                        recevoir par courrier électronique (E-mail, SMS, MMS, message laissé sur répondeur) des informations commerciales sur les services et/ou offres du vendeur et de ses partenaires
                        Article 17- Droit à l’image
                        Les photographies prises à l’occasion du chantier réalisé peuvent être utilisées pour promouvoir le savoir-faire et l’image de l’entreprise, notamment pour les documents commerciaux, site internet…
                        A la signature du bon de commande et à tout moment, le client a la faculté de révoquer cette autorisation par simple écrit de sa part
                        Article 18- Propriétés intellectuelles
                        La société SYNERGYS reste propriétaire de tous les droits de propriété intellectuelles sur les photographies, présentations, études, dessins, modèles, etc…
                        Réalisés (même à la demande du client) en vue de la fourniture du produit et/ou du service au client. Le client s’interdit donc toute reproduction ou exploitation des dites photographies, présentations, études, dessins, modèles etc… sans autorisation expresse écrite et
                        préalable de SYNERGYS
                        Article 19-Litiges
                        Tous les litiges auxquels les opérations d’achat et de vente conclus en application des présentes CGV pourraient donner lieu, concernant tant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs suites et qui n’auraient pas pu être
                        résolus à l’amiable entre SYNERGYS et le client seront soumis aux tribunaux compétents dans les conditions du droit commun.
                        Le client est informé qu’il peut en tout état de cause recourir à une médiation conventionnelle notamment auprès de la commission de la médiation de la consommation (article L534-7 du code de la consommation) ou auprès des instances de médiation sectorielle existantes
                        ou à tout mode alternatif de règlement des différends (conciliation par exemple) en cas de contestation.
                        Le présent contrat est soumis à la loi française. Toute réclamation doit être adressée à notre société par lettre recommandée avec AR. En cas de litiges, ceci relève de la juridiction compétente conformément aux règles du nouveau code procédure civile. Cependant, si
                        la demande du client auprès de la société n’a pas abouti, celui-ci est averti que d’autres voies de recours s’offrent à lui et, en particulier, le recours à la médiation conventionnelle. Le client pourra ainsi adresser sa demande de règlement amiable de son différend
                        gratuitement à l’association française de défense des consommateurs européens (AFDCE) 655 chemin des Jallassières 13510 AIGUILLES Email : secrétariat@afdce.org tél : 04.42.24.32.81. L’AFDCE est membre de l’ANM.
                        Article 20- Invalidité partielle
                        La nullité ou d’une applicabilité de l’une quelconque des stipulations du présent contrat n’emportera pas nullité des autres stipulations qui conserveront toute leur force et leur portée. Cependant, les parties pourront d’un comme un accord convenir de remplacer la houle
                        les stipulations invalidées.
                    </Text>
                </ScrollView>

                <TouchableOpacity
                    //disabled={!this.state.accepted}
                    onPress={this.props.acceptTerms}
                    //style={this.state.accepted ? styles.button : styles.buttonDisabled}>
                    style={styles.button}>
                    <Text style={styles.buttonLabel}>J'ai lu et accepté</Text>
                </TouchableOpacity>
            </Modal >
        )
    }

}

const { width, height } = Dimensions.get('window');

const styles = {

    container: {
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10
    },
    title: {
        fontSize: 22,
        alignSelf: 'center'
    },
    tcP: {
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12
    },
    tcP: {
        marginTop: 10,
        fontSize: 12
    },
    tcL: {
        marginLeft: 10,
        marginTop: 10,
        marginBottom: 10,
        fontSize: 12
    },
    tcContainer: {
        marginTop: 15,
        marginBottom: 15,
        height: height * .7
    },

    button: {
        backgroundColor: theme.colors.primary,
        // borderRadius: 5,
        padding: 10
    },

    buttonDisabled: {
        backgroundColor: '#999',
        //borderRadius: 5,
        padding: 10
    },

    buttonLabel: {
        fontSize: 14,
        color: '#FFF',
        alignSelf: 'center'
    },
    article: {
        marginBottom: 15
    },
    header: {
        marginBottom: 5
    }

}
