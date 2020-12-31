import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import { uint8ToBase64, base64ToArrayBuffer } from './core/utils'
import { constants } from './core/constants'
import RNFetchBlob from 'rn-fetch-blob'
import RNFS from 'react-native-fs'


import moment from 'moment';
import 'moment/locale/fr'
moment.locale('fr')

export default class template extends Component {
    constructor(props) {
        super(props)
        this.state = {
            a: ''
        }
    }

    componentDidMount() {
        //this.createPDF()
        //this.listDirsMainBundle()
        this.createDoc()
    }

    listDirsMainBundle() {
        RNFS.readDir(RNFS.MainBundlePath)
            .then((result) => {
                console.log('GOT RESULT', result);

                // stat the first file
                // return Promise.all([RNFS.stat(result[0].path), result[0].path]);
            })
        // .then((statResult) => {
        //     if (statResult[0].isFile()) {
        //         // if we have a file, read it
        //         return RNFS.readFile(statResult[1], 'utf8');
        //     }

        //     return 'no file';
        // })
        // .then((contents) => {
        //     // log the file contents
        //     console.log(contents);
        // })
        // .catch((err) => {
        //     console.log(err.message, err.code);
        // });
    }

    createDoc() {
        // create a path you want to write to
        // create a path you want to write to
        // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
        // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
        var path = RNFS.DocumentDirectoryPath + '/hhhhhhhhhhhhhhhhhhhhhhh.txt';

        // write the file
        RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
            .then((success) => {
                console.log('FILE WRITTEN!');
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    async createPDF() {
        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create()

        // Embed the Times Roman font
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)

        // Add a blank page to the document
        const page = pdfDoc.addPage()

        // Get the width and height of the page
        const { width, height } = page.getSize()

        // Draw a string of text toward the top of the page
        const fontSize = 30
        page.drawText('Creating PDFs in JavaScript is awesome!', {
            x: 50,
            y: height - 4 * fontSize,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0.53, 0.71),
        })

        // Serialize the PDFDocument to bytes (a Uint8Array)
        const pdfBytes = await pdfDoc.save()

        const pdfBase64 = uint8ToBase64(pdfBytes);
        const path = `${RNFetchBlob.fs.dirs.DownloadDir}/Synergys/Documents/${this.fileName}`

        RNFS.writeFile(path, pdfBase64, "base64")
            .then((success) => this.setState({ newPdfSaved: true, newPdfPath: path, pdfBase64: pdfBase64, pdfArrayBuffer: base64ToArrayBuffer(pdfBase64), filePath: path }))
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.filePath &&
                    <View style={styles.pdfContainer}>
                        <Pdf
                            minScale={1.0}
                            maxScale={1.0}
                            scale={1.0}
                            spacing={0}
                            fitPolicy={0}
                            enablePaging={true}
                            source={{ uri: filePath }}
                            usePDFKit={false}
                            onLoadComplete={(numberOfPages, filePath, { width, height }) => {
                                this.setState({ pageWidth: width, pageHeight: height })
                            }}
                            onPageSingleTap={(page, x, y) => {
                                console.log('555')
                                this.handleSingleTap(page, x, y)
                            }}
                            style={[styles.pdf]} />
                    </View>
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pdfContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'pink',
    },
    pdf: {
        flex: 1,
        width: constants.ScreenWidth, //fixed to screen width
        backgroundColor: 'gray'
    },
});

