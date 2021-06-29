
import React, { Component } from "react"
import { StyleSheet, Dimensions, View } from "react-native"
import { PDFDocument, PageSizes, StandardFonts, rgb, values, PDFTextField, degrees, grayscale } from 'pdf-lib'
import Pdf from "react-native-pdf"
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'

import { db } from './firebase'
import Appbar from './components/Appbar'
import Button from "./components/Button"
import LoadDialog from './components/LoadDialog'

import moment, { months } from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

// import { fetchAsset, writePdf } from './assets'
import { logoBase64 } from './assets/logoBase64'
import { termsBase64 } from './assets/termsAndConditionsBase64'
import { uint8ToBase64, base64ToArrayBuffer, articles_fr, setToast, saveFile, displayError } from './core/utils'
import { sizes } from './core/theme'
import * as theme from './core/theme'
import { constants, errorMessages } from "./core/constants"
import { Alert } from "react-native"

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

export default class PdfGen extends Component {

    constructor(props) {
        super(props)
        this.titleText = "Test formulaire"

        this.state = {
            path: '',
            pdfBase64: '',
            loading: true
        }
    }

    componentDidMount() {
        this.generatePurchaseDoc()
    }

    lineBreaker(dataArray, font, size, maxWidth) {

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

    async generatePurchaseDoc() {
        try {
            // Create a new PDFDocument
            const pdfDoc = await PDFDocument.create()

            // Add a blank page to the document
            const page = pdfDoc.addPage([550, 750])

            // Get the form so we can add fields to it
            const form = pdfDoc.getForm()

            // Add the superhero text field and description
            page.drawText('Enter your favorite superhero:', { x: 50, y: 700, size: 20 })

            const superheroField = form.createTextField('favorite.superhero')
            superheroField.setText('One Punch Man')
            superheroField.addToPage(page, { x: 55, y: 640 })

            // Add the rocket radio group, labels, and description
            page.drawText('Select your favorite rocket:', { x: 50, y: 600, size: 20 })

            page.drawText('Falcon Heavy', { x: 120, y: 560, size: 18 })
            page.drawText('Saturn IV', { x: 120, y: 500, size: 18 })
            page.drawText('Delta IV Heavy', { x: 340, y: 560, size: 18 })
            page.drawText('Space Launch System', { x: 340, y: 500, size: 18 })

            const rocketField = form.createRadioGroup('favorite.rocket')
            rocketField.addOptionToPage('Falcon Heavy', page, { x: 55, y: 540 })
            rocketField.addOptionToPage('Saturn IV', page, { x: 55, y: 480 })
            rocketField.addOptionToPage('Delta IV Heavy', page, { x: 275, y: 540 })
            rocketField.addOptionToPage('Space Launch System', page, { x: 275, y: 480 })
            rocketField.select('Saturn IV')

            // Add the gundam check boxes, labels, and description
            page.drawText('Select your favorite gundams:', { x: 50, y: 440, size: 20 })

            page.drawText('Exia', { x: 120, y: 400, size: 18 })
            page.drawText('Kyrios', { x: 120, y: 340, size: 18 })
            page.drawText('Virtue', { x: 340, y: 400, size: 18 })
            page.drawText('Dynames', { x: 340, y: 340, size: 18 })

            const exiaField = form.createCheckBox('gundam.exia')
            const kyriosField = form.createCheckBox('gundam.kyrios')
            const virtueField = form.createCheckBox('gundam.virtue')
            const dynamesField = form.createCheckBox('gundam.dynames')

            exiaField.addToPage(page, { x: 55, y: 380 })
            kyriosField.addToPage(page, { x: 55, y: 320 })
            virtueField.addToPage(page, { x: 275, y: 380 })
            dynamesField.addToPage(page, { x: 275, y: 320 })

            exiaField.check()
            dynamesField.check()

            // Add the planet dropdown and description
            page.drawText('Select your favorite planet*:', { x: 50, y: 280, size: 20 })

            const planetsField = form.createDropdown('favorite.planet')
            planetsField.addOptions(['Venus', 'Earth', 'Mars', 'Pluto'])
            planetsField.select('Pluto')
            planetsField.addToPage(page, { x: 55, y: 220 })

            // Add the person option list and description
            page.drawText('Select your favorite person:', { x: 50, y: 180, size: 18 })

            const personField = form.createOptionList('favorite.person')
            personField.addOptions([
                'Julius Caesar',
                'Ada Lovelace',
                'Cleopatra',
                'Aaron Burr',
                'Mark Antony',
            ])
            personField.select('Ada Lovelace')
            personField.addToPage(page, { x: 55, y: 70 })

            // Just saying...
            page.drawText(`* Pluto should be a planet too!`, { x: 15, y: 15, size: 15 })

            // Serialize the PDFDocument to bytes (a Uint8Array)
            const pdfBytes = await pdfDoc.save()
            const pdfBase64 = uint8ToBase64(pdfBytes)
            const path = `${downloadDir}/Synergys/Documents/Scan signé ${moment().format('DD-MM-YYYY HHmmss')}.pdf`
            RNFS.writeFile(path, pdfBase64, "base64")
                .then((success) => this.setState({ path }))
                .catch((err) => setToast(this, 'e', 'Erreur inattendue, veuillez réessayer.'))
                .finally(() => loadLog(this, false, ''))
        }

        catch (e) {
            displayError({ message: errorMessages.pdfGen })
        }
    }

    render() {
        const { path, pdfBase64, loading } = this.state

        return (
            <View style={{ flex: 1 }}>
                <Appbar back title titleText={this.titleText} />
                <View style={styles.container} >
                    {path !== '' &&
                        <Pdf
                            source={path}
                            // onLoadComplete={(numberOfPages, filePath, { width, height }) => {
                            //     console.log(`number of pages: ${numberOfPages}`)
                            //     console.log(`width: ${width}`)
                            //     console.log(`height: ${height}`)
                            // }}
                            // onPageChanged={(page, numberOfPages) => {
                            //     console.log(`current page: ${page}`)
                            // }}
                            // onError={(error) => {
                            //     console.log(error)
                            // }}
                            // onPressLink={(uri) => {
                            //     console.log(`Link presse: ${uri}`)
                            // }}
                            style={styles.pdf} />
                    }
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4"
    },
    pdf: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    }
})













