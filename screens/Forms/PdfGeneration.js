
import React, { Component } from "react"
import { StyleSheet, Dimensions, View } from "react-native"
import { PDFDocument, PageSizes, StandardFonts, rgb, values, PDFTextField, degrees, grayscale } from 'pdf-lib'
import Pdf from "react-native-pdf"
import RNFS from 'react-native-fs'
import RNFetchBlob from 'rn-fetch-blob'

import { db } from '../../firebase'
import Appbar from '../../components/Appbar'
import Button from "../../components/Button"
import LoadDialog from '../../components/LoadDialog'
import { ficheEEBBase64 } from "../../core/files";

import moment, { months } from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

// import { fetchAsset, writePdf } from './assets'
import { uint8ToBase64, base64ToArrayBuffer, articles_fr, setToast, saveFile, displayError } from '../../core/utils'
import { sizes } from '../../core/theme'
import * as theme from '../../core/theme'
import { constants, downloadDir, errorMessages } from "../../core/constants"
import { requestRESPermission, requestWESPermission } from "../../core/permissions"

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
      pdfBase64: null,
      loading: true
    }
  }

  async componentDidMount() {
    await this.generateFichEEB()
  }

  async generateFichEEB() {
    try {
      const pdfDoc = await PDFDocument.load(ficheEEBBase64)
      const pages = pdfDoc.getPages()
      const firstPage = pages[0]

      firstPage.drawSquare({
        x: firstPage.getWidth()-396,
        y: firstPage.getHeight()-104,
        size: 7,
        color: rgb(0, 0, 0),
      })

      firstPage.drawSquare({
        x: firstPage.getWidth()-319,
        y: firstPage.getHeight()-104,
        size: 7,
        color: rgb(0, 0, 0),
      })

      firstPage.drawSquare({
        x: firstPage.getWidth()-319,
        y: firstPage.getHeight()-117,
        size: 7,
        color: rgb(0, 0, 0),
      })

      const pdfBytes = await pdfDoc.save()
      const pdfBase64 = uint8ToBase64(pdfBytes)
      this.setState({ pdfBase64 })
    }

    catch (e) {
      console.log(e)
      displayError({ message: errorMessages.pdfGen })
    }
  }

  render() {
    const { path, pdfBase64, loading } = this.state
    if (pdfBase64)
      var source = { uri: `data:application/pdf;base64,${pdfBase64}` }

    return (
      <View style={{ flex: 1 }}>
        <Appbar back title titleText={this.titleText} />
        <View style={styles.container} >
          {
            pdfBase64 &&
            <Pdf
              source={source}
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
