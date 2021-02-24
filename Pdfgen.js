
import React, { Component } from "react"
import { StyleSheet, Dimensions, View } from "react-native"
import { PDFDocument, PageSizes, StandardFonts, rgb, values, PDFTextField, degrees, grayscale } from 'pdf-lib'
import Pdf from "react-native-pdf"
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'

import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

// import { fetchAsset, writePdf } from './assets'
import { uint8ToBase64, base64ToArrayBuffer, downloadFile } from './core/utils'
import { sizes } from './core/theme'
import { max } from "react-native-reanimated"

//urls
const urlForm = "https://firebasestorage.googleapis.com/v0/b/projectmanagement-b9677.appspot.com/o/Templates%2Fdod_character.pdf?alt=media&token=b2c00766-4377-4d31-ad38-fad84eac5376"
const urlMario = "https://firebasestorage.googleapis.com/v0/b/projectmanagement-b9677.appspot.com/o/Templates%2FAssets%2Fsmall_mario.png?alt=media&token=505b1663-13c5-49b7-91ec-2a4afa0f1bb9"
const urlEmblem = "https://firebasestorage.googleapis.com/v0/b/projectmanagement-b9677.appspot.com/o/Templates%2FAssets%2Fmario_emblem.png?alt=media&token=28813b1e-06c5-487a-bedb-489a0c3f6ed1"

//local paths
const formPath = `${RNFetchBlob.fs.dirs.DownloadDir}/Synergys/Documents/Messagerie/dod_character`
const marioImagePath = `${RNFetchBlob.fs.dirs.DownloadDir}/Synergys/Documents/Messagerie/small_mario`
const emblemImagePath = `${RNFetchBlob.fs.dirs.DownloadDir}/Synergys/Documents/Messagerie/mario_emblem`


const { base, font, radius, padding, h1, h2, h3, header, body } = sizes
const caption = 10
const lineHeight = 12

export default class PdfGeneration extends Component {

    constructor(props) {
        super(props)

        this.state = {
            source: ''
        }
    }

    async componentDidMount() {
        await this.createNewPdf()
    }

    lineBreaker(dataArray, font, size, maxWidth) {

        const constant = (length) => {
            let c = 5
            if (length < 5) c = 10
            return c
        }

        let dataArrayFormated = []
        const line_Height = font.heightAtSize(size)

        for (var line of dataArray) {
            const lineWidth = font.widthOfTextAtSize(line, size)

            if (lineWidth > maxWidth) {

                var lineLength = line.length
                var lastCharIndex = maxWidth * lineLength / lineWidth

                //Avoid spliting words
                while (line.charAt(lastCharIndex) !== ' ') {
                    lastCharIndex = lastCharIndex - 1
                }

                var slicedLine = line.slice(0, lastCharIndex)
                dataArrayFormated.push(slicedLine)

                var restOfLine = line.slice(lastCharIndex)
                var restOfLineWidth = font.widthOfTextAtSize(restOfLine, size)

                while (restOfLineWidth > maxWidth) {
                    lineLength = restOfLine.length
                    lastCharIndex = maxWidth * lineLength / restOfLineWidth

                    //Avoid spliting words
                    while (restOfLine.charAt(lastCharIndex) !== ' ') {
                        lastCharIndex = lastCharIndex - 1
                    }

                    slicedLine = restOfLine.slice(0, lastCharIndex)
                    dataArrayFormated.push(slicedLine)

                    restOfLine = restOfLine.slice(lastCharIndex)
                    restOfLineWidth = font.widthOfTextAtSize(restOfLine, size)
                }

                dataArrayFormated.push(restOfLine)
            }

            else dataArrayFormated.push(line)
        }

        return dataArrayFormated
    }

    async createNewPdf() {

        const pdfDoc = await PDFDocument.create()

        // Font config
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
        const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
        const primaryColor = rgb(0, 0, 0)
        const caption = 10
        const lineHeight = 12
        const cste = 10

        // Add a blank page to the document
        const page = pdfDoc.addPage(PageSizes.A4)

        // Get the width and height of the page
        const { width, height } = page.getSize()

        //Tests
        let maxWidth = width * 0.5
        let marginTop = 100

        const productNames = [
            "Fourniture d'une pompe à chaleur AIR / EAU Hitachi Yutaki S moyenne température taille 3. Module Hydraulique intérieur monophasé - Puissance nominale/max chauffage (-7°C ext / 35°c eau) : 5,8/7,5 kW - Puissance nominale/max chauffage (-7°C ext / 55°c eau) : 5,00/5,5 kW - Poids net : 37kg - Dimensions 712x450x275mm - Niveau de puissance sonore : 37dB. Groupe extérieur - Puissance absorbée nominale chauffage (7°C ext/35°C eau) : 1,60 kW - COP = 4,60 - ETAS : ns ( 55°C) en chauffage 127 % - Puissance acoustique mode chaud : 64 dB - Dimensions 629x799x300mm - Poids net : 44kg - Fluide frigorigène R32 - Compresseur ROTATIF. Référence Module Hydraulique RWM-3.0NR E - Référence Groupe Extérieur Premium RAS-3WHVRP. Matériel éligible CITE. ",
            "Forfait matériel de mise en œuvre (pot à boue, disconnecteur, liaisons frigorifiques, liaisons hydrauliques...)",
            "3 Forfait dépose chaudière Fioul hors condensation",
            "Forfait dépose cuve à Fioul",
            "Installation et mise en service d'une pompe à chaleur Air/Eau"
        ]

        for (const productName of productNames) {
            const textArray = [productName]
            const textArrayFormated = this.lineBreaker(textArray, timesRomanFont, caption, maxWidth)

            textArrayFormated.forEach((text) => {
                page.drawText(text,
                    {
                        x: 10,
                        y: height - marginTop,
                        size: caption,
                        font: timesRomanFont,
                        lineHeight,
                        color: primaryColor,
                    })

                marginTop = marginTop + timesRomanFont.sizeAtHeight(caption)
            })

            marginTop = marginTop + cste
        }

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save()
        const pdfBase64 = uint8ToBase64(pdfBytes)

        const source = { uri: `data:application/pdf;base64,${pdfBase64}` }
        this.setState({ source })
    }

    render() {
        const { source } = this.state
        // const source = { uri: "http://samples.leanpub.com/thereactnativebook-sample.pdf", cache: true }
        return (
            <View style={styles.container} >
                {source !== '' &&
                    <Pdf
                        source={source}
                        onLoadComplete={(numberOfPages, filePath, { width, height }) => {
                            console.log(`number of pages: ${numberOfPages}`)
                            console.log(`width: ${width}`)
                            console.log(`height: ${height}`)
                        }}
                        onPageChanged={(page, numberOfPages) => {
                            console.log(`current page: ${page}`)
                        }}
                        onError={(error) => {
                            console.log(error)
                        }}
                        onPressLink={(uri) => {
                            console.log(`Link presse: ${uri}`)
                        }}
                        style={styles.pdf} />
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        //marginTop: 25,
        backgroundColor: "#f4f4f4"
    },
    pdf: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    }
})
















// async createForm() {
//     // Create a new PDFDocument
//     const pdfDoc = await PDFDocument.create()

//     // Add a blank page to the document
//     const page = pdfDoc.addPage([550, 750])

//     // Get the form so we can add fields to it
//     const form = pdfDoc.getForm()

//     // Add the superhero text field and description
//     page.drawText('Enter your favorite superhero:', { x: 50, y: 700, size: 20 })

//     const superheroField = form.createTextField('favorite.superhero')
//     superheroField.setText('One Punch Man')
//     superheroField.addToPage(page, { x: 55, y: 640 })

//     // Add the rocket radio group, labels, and description
//     page.drawText('Select your favorite rocket:', { x: 50, y: 600, size: 20 })

//     page.drawText('Falcon Heavy', { x: 120, y: 560, size: 18 })
//     page.drawText('Saturn IV', { x: 120, y: 500, size: 18 })
//     page.drawText('Delta IV Heavy', { x: 340, y: 560, size: 18 })
//     page.drawText('Space Launch System', { x: 340, y: 500, size: 18 })

//     const rocketField = form.createRadioGroup('favorite.rocket')
//     rocketField.addOptionToPage('Falcon Heavy', page, { x: 55, y: 540 })
//     rocketField.addOptionToPage('Saturn IV', page, { x: 55, y: 480 })
//     rocketField.addOptionToPage('Delta IV Heavy', page, { x: 275, y: 540 })
//     rocketField.addOptionToPage('Space Launch System', page, { x: 275, y: 480 })
//     rocketField.select('Saturn IV')

//     // Add the gundam check boxes, labels, and description
//     page.drawText('Select your favorite gundams:', { x: 50, y: 440, size: 20 })

//     page.drawText('Exia', { x: 120, y: 400, size: 18 })
//     page.drawText('Kyrios', { x: 120, y: 340, size: 18 })
//     page.drawText('Virtue', { x: 340, y: 400, size: 18 })
//     page.drawText('Dynames', { x: 340, y: 340, size: 18 })

//     const exiaField = form.createCheckBox('gundam.exia')
//     const kyriosField = form.createCheckBox('gundam.kyrios')
//     const virtueField = form.createCheckBox('gundam.virtue')
//     const dynamesField = form.createCheckBox('gundam.dynames')

//     exiaField.addToPage(page, { x: 55, y: 380 })
//     kyriosField.addToPage(page, { x: 55, y: 320 })
//     virtueField.addToPage(page, { x: 275, y: 380 })
//     dynamesField.addToPage(page, { x: 275, y: 320 })

//     exiaField.check()
//     dynamesField.check()

//     // Add the planet dropdown and description
//     page.drawText('Select your favorite planet*:', { x: 50, y: 280, size: 20 })

//     const planetsField = form.createDropdown('favorite.planet')
//     planetsField.addOptions(['Venus', 'Earth', 'Mars', 'Pluto'])
//     planetsField.select('Pluto')
//     planetsField.addToPage(page, { x: 55, y: 220 })

//     // Add the person option list and description
//     page.drawText('Select your favorite person:', { x: 50, y: 180, size: 18 })

//     const personField = form.createOptionList('favorite.person')
//     personField.addOptions([
//         'Julius Caesar',
//         'Ada Lovelace',
//         'Cleopatra',
//         'Aaron Burr',
//         'Mark Antony',
//     ])
//     personField.select('Ada Lovelace')
//     personField.addToPage(page, { x: 55, y: 70 })

//     // Just saying...
//     page.drawText(`* Pluto should be a planet too!`, { x: 15, y: 15, size: 15 })

//     // Serialize the PDFDocument to bytes (a Uint8Array)
//     const pdfBytes = await pdfDoc.save()

//     const pdfBase64 = uint8ToBase64(pdfBytes)
//     const source = { uri: `data:application/pdf;base64,${pdfBase64}` }
//     this.setState({ source })

//     // For example, `pdfBytes` can be:
//     //   • Written to a file in Node
//     //   • Downloaded from the browser
//     //   • Rendered in an <iframe>
// }

// async fillForm() {

//     const formPath = `${RNFetchBlob.fs.dirs.DownloadDir}/Synergys/Documents/Messagerie/dod_character`
//     const marioImagePath = `${RNFetchBlob.fs.dirs.DownloadDir}/Synergys/Documents/Messagerie/small_mario`
//     const emblemImagePath = `${RNFetchBlob.fs.dirs.DownloadDir}/Synergys/Documents/Messagerie/mario_emblem`

//     const pdfBase64 = await RNFetchBlob.fs.readFile(formPath, 'base64')
//     const marioImageBase64 = await RNFetchBlob.fs.readFile(marioImagePath, 'base64')
//     const emblemImageBase64 = await RNFetchBlob.fs.readFile(emblemImagePath, 'base64')

//     const formPdfBytes = base64ToArrayBuffer(pdfBase64)
//     const marioImageBytes = base64ToArrayBuffer(marioImageBase64)
//     const emblemImageBytes = base64ToArrayBuffer(emblemImageBase64)

//     // Load a PDF with form fields
//     const pdfDoc = await PDFDocument.load(formPdfBytes)
//     console.log('pdf loaded')

//     // Embed the Mario and emblem images
//     const marioImage = await pdfDoc.embedPng(marioImageBytes)
//     const emblemImage = await pdfDoc.embedPng(emblemImageBytes)
//     console.log('pngs embedded')
//     // console.log('marioImage', marioImage)
//     // console.log('emblemImage', emblemImage)

//     // Get the form containing all the fields
//     const form = pdfDoc.getForm()
//     console.log('form', form)

//     // Get all fields in the PDF by their names
//     const nameField = form.getTextField('CharacterName 2')
//     const ageField = form.getTextField('Age')
//     const heightField = form.getTextField('Height')
//     const weightField = form.getTextField('Weight')
//     const eyesField = form.getTextField('Eyes')
//     const skinField = form.getTextField('Skin')
//     const hairField = form.getTextField('Hair')

//     const alliesField = form.getTextField('Allies')
//     const factionField = form.getTextField('FactionName')
//     const backstoryField = form.getTextField('Backstory')
//     const traitsField = form.getTextField('Feat+Traits')
//     const treasureField = form.getTextField('Treasure')

//     const characterImageField = form.getButton('CHARACTER IMAGE')
//     const factionImageField = form.getTextField('Faction Symbol Image')

//     console.log('All fields retrieved')

//     // Fill in the basic info fields
//     nameField.setText('Mario')
//     ageField.setText('24 years')
//     heightField.setText(`5' 1"`)
//     weightField.setText('196 lbs')
//     eyesField.setText('blue')
//     skinField.setText('white')
//     hairField.setText('brown')

//     console.log('Basic info fields filled')

//     // Fill the character image field with our Mario image
//     characterImageField.setImage(marioImage)
//     console.log('Fill the character image field with our Mario imageBasic info fields filled')

//     // Fill in the allies field
//     alliesField.setText(
//         [
//             `Allies:`,
//             `  • Princess Daisy`,
//             `  • Princess Peach`,
//             `  • Rosalina`,
//             `  • Geno`,
//             `  • Luigi`,
//             `  • Donkey Kong`,
//             `  • Yoshi`,
//             `  • Diddy Kong`,
//             ``,
//             `Organizations:`,
//             `  • Italian Plumbers Association`,
//         ].join('\n'),
//     )

//     console.log('Fill in the allies field')

//     // Fill in the faction name field
//     factionField.setText(`Mario's Emblem`)
//     console.log('Fill in the faction name field')


//     // Fill the faction image field with our emblem image
//     factionImageField.setImage(emblemImage)
//     console.log('Fill the faction image field with our emblem image')

//     // Fill in the backstory field
//     backstoryField.setText(
//         `Mario is a fictional character in the Mario video game franchise, owned by Nintendo and created by Japanese video game designer Shigeru Miyamoto. Serving as the company's mascot and the eponymous protagonist of the series, Mario has appeared in over 200 video games since his creation. Depicted as a short, pudgy, Italian plumber who resides in the Mushroom Kingdom, his adventures generally center upon rescuing Princess Peach from the Koopa villain Bowser. His younger brother and sidekick is Luigi.`,
//     )
//     console.log('Fill in the backstory field')

//     // Fill in the traits field
//     traitsField.setText(
//         [
//             `Mario can use three basic three power-ups:`,
//             `  • the Super Mushroom, which causes Mario to grow larger`,
//             `  • the Fire Flower, which allows Mario to throw fireballs`,
//             `  • the Starman, which gives Mario temporary invincibility`,
//         ].join('\n'),
//     )
//     console.log(' Fill in the traits field')

//     // Fill in the treasure field
//     treasureField.setText(['• Gold coins', '• Treasure chests'].join('\n'))
//     console.log('Fill in the treasure field')

//     // Serialize the PDFDocument to bytes (a Uint8Array)
//     const pdfBytes = await pdfDoc.save().catch((e) => console.error(e))

//     console.log('pdfBytes:::::::::::::', pdfBytes)
// }










// async createForm() {

//     const fieldNames = {
//         // Page 1
//         LegalName: 'form1[0].Page1[0].BeforeYouBegin[0].BusinessInfo[0].LegalName[0]',
//         BusinessNumber1: 'form1[0].Page1[0].BeforeYouBegin[0].BusinessInfo[0].AccountNumber[0].BusinessNumber_RT1[0]',
//         BusinessNumber2: 'form1[0].Page1[0].BeforeYouBegin[0].BusinessInfo[0].AccountNumber[0].BusinessNumber_RT2[0]',
//         BusinessAddress: 'form1[0].Page1[0].BeforeYouBegin[0].PhysicalAddress[0].BusinessAddress[0]',
//         City: 'form1[0].Page1[0].BeforeYouBegin[0].PhysicalAddress[0].City[0]',
//         Province: 'form1[0].Page1[0].BeforeYouBegin[0].PhysicalAddress[0].Province[0]',
//         PostalCode: 'form1[0].Page1[0].BeforeYouBegin[0].PhysicalAddress[0].PostalCode[0]',
//         TypeOfReturn: 'form1[0].Page1[0].BeforeYouBegin[0].Type[0].RadioButtonGroup[0]',
//         FromDate: 'form1[0].Page1[0].BeforeYouBegin[0].Period[0].FromToDates_Comb_Adv_EN[0].FromDate[0]',
//         ToDate: 'form1[0].Page1[0].BeforeYouBegin[0].Period[0].FromToDates_Comb_Adv_EN[0].ToDate[0]',

//         // Page 2
//         Amount1: 'form1[0].Page12[0].SalesDutyPage12[0].AmountDue[0].DutyPayable[0].DutyPayable[0].Amount[0]',
//         Amount2: 'form1[0].Page12[0].SalesDutyPage12[0].AmountDue[0].AdditionalDutyPayable[0].AdditionalDutyPayable[0].Amount[0]',
//         Amount3: 'form1[0].Page12[0].SalesDutyPage12[0].AmountDue[0].AjustmentAdditionalDutyPayable[0].AjustmentAdditionalDutyPayable[0].Amount[0]',
//         Amount4: 'form1[0].Page12[0].SalesDutyPage12[0].AmountDue[0].NetPayable[0].NetPayable[0].Amount[0]',
//         Amount5: 'form1[0].Page12[0].SalesDutyPage12[0].AmountDue[0].Refund[0].Refund[0].Amount[0]',
//         Amount6: 'form1[0].Page12[0].SalesDutyPage12[0].AmountDue[0].AmountDue[0].AmountDue[0].Amount[0]',
//         ByDueDate: 'form1[0].Page12[0].SalesDutyPage12[0].ByDueDate[0]',
//         Name: 'form1[0].Page12[0].Certification[0].Signature[0].Name[0]',
//         Title: 'form1[0].Page12[0].Certification[0].Signature[0].Title[0]',
//         PhoneNumber: 'form1[0].Page12[0].Certification[0].Signature[0].Phone_Ext[0].TelephoneNumberSplit[0].PhoneNumber[0]',
//         PhoneExt: 'form1[0].Page12[0].Certification[0].Signature[0].Phone_Ext[0].Ext[0]',
//         SignatureDate: 'form1[0].Page12[0].Certification[0].Signature[0].Date[0].DateYYYYMMDD_Comb[0]',
//     }

//     const pdfDoc = await PDFDocument.load(await fetchAsset('pdfs/with_combed_fields.pdf'))

//     console.log('pdfDoc', pdfDoc)

//     const form = pdfDoc.getForm()

//     const legalName = form.getTextField(fieldNames.LegalName)
//     legalName.setText('Purple People Eater')

//     const businessNumber1 = form.getTextField(fieldNames.BusinessNumber1)
//     businessNumber1.setText('123456789')

//     const businessNumber2 = form.getTextField(fieldNames.BusinessNumber2)
//     businessNumber2.setText('9876')

//     const businessAddress = form.getTextField(fieldNames.BusinessAddress)
//     businessAddress.setText('873 Lantern Lane')

//     const city = form.getTextField(fieldNames.City)
//     city.setText('Tuckerton')

//     const province = form.getDropdown(fieldNames.Province)
//     province.select('Saskatchewan')

//     const postalCode = form.getTextField(fieldNames.PostalCode)
//     postalCode.setText('08087')

//     const typeOfReturn = form.getRadioGroup(fieldNames.TypeOfReturn)
//     typeOfReturn.select('1')

//     const fromDate = form.getTextField(fieldNames.FromDate)
//     fromDate.setText(['2019', '11', '05'].join(''))

//     const toDate = form.getTextField(fieldNames.ToDate)
//     toDate.setText(['2020', '01', '18'].join(''))

//     const amount1 = form.getTextField(fieldNames.Amount1)
//     amount1.setText('100')

//     const amount2 = form.getTextField(fieldNames.Amount2)
//     amount2.setText('200')

//     const amount3 = form.getTextField(fieldNames.Amount3)
//     amount3.setText('300')

//     const amount4 = form.getTextField(fieldNames.Amount4)
//     amount4.setText('400')

//     const amount5 = form.getTextField(fieldNames.Amount5)
//     amount5.setText('500')

//     const amount6 = form.getTextField(fieldNames.Amount6)
//     amount6.setText('600')

//     const byDueDate = form.getRadioGroup(fieldNames.ByDueDate)
//     byDueDate.select('2')

//     const name = form.getTextField(fieldNames.Name)
//     name.setText('Arthur Pendragon')

//     const title = form.getTextField(fieldNames.Title)
//     title.setText('King')

//     const phoneNumber = form.getTextField(fieldNames.PhoneNumber)
//     phoneNumber.setText('(123) 456-7890')

//     const phoneExt = form.getTextField(fieldNames.PhoneExt)
//     phoneExt.setText('1')

//     const signatureDate = form.getTextField(fieldNames.SignatureDate)
//     signatureDate.setText(['2020', '07', '13'].join(''))

//     // Fill in remaining fields with random numeric values
//     const fieldNameValues = values(fieldNames)
//     const fields = form.getFields()
//     fields.forEach((field) => {
//         if (!fieldNameValues.includes(field.getName())) {
//             if (field instanceof PDFTextField) {
//                 const value = String(Math.floor(Math.random() * 1000000) / 100)
//                 field.setText(value.substring(0, field.getMaxLength()))
//             }
//         }
//     })

//     const base64Pdf = await pdfDoc.saveAsBase64({ dataUri: true })

//     console.log('pdf base 64', base64Pdf)
// }












//BASICS

// const dirs = RNFetchBlob.fs.dirs
// console.log(dirs.DocumentDir)
// console.log(dirs.CacheDir)
// console.log(dirs.DCIMDir)
// console.log(dirs.DocumentDir)

// const fs = RNFetchBlob.fs
// const DocumentDir = fs.dirs.DocumentDir
// const path = `${DocumentDir}/foo`
// const newPath = `${DocumentDir}/bar`
// const base64 = RNFetchBlob.base64

        // fs.createFile(path, 'foo', 'utf8')
        //     .then(() => console.log('File written'))
        //     .catch((e) => console.error(e))

        // fs.createFile(newPath, path, 'uri')
        //     .then(() => console.log('File created from another one'))
        //     .catch((e) => console.error(e))

        // RNFetchBlob.fs.stat(devisPath)
        //     .then((stats) => console.log(stats))
        //     .catch((e) => console.error(e))

        // RNFetchBlob.fs.unlink(newPath)
        //     .then(() => console.log('File deleted'))
        //     .catch((e) => console.error(e))

        // write bytes to file
        // RNFetchBlob.fs.appendFile(path, [102, 111, 111], 'ascii')
        //     .then(() => console.log('File ascii written'))
        //     .catch((e) => console.error(e))

        // // write base64 data to file
        // RNFetchBlob.fs.appendFile(path, RNFetchBlob.base64.encode('foo'), 'base64')
        //     .then(() => console.log('File Base64 written'))
        //     .catch((e) => console.error(e))

        // RNFetchBlob.fs.writeFile(path, RNFetchBlob.base64.encode('foo'), 'base64')
        //     .then(() => console.log('File Base64 written'))
        //     .catch((e) => console.error(e))