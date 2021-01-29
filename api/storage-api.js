import { setToast } from "../core/utils"
import firebase from '@react-native-firebase/app'
const db = firebase.firestore()

export async function uploadFiles(files, storageRef, attachedFiles, isChat, chatId) {
    const promises = []
    let urls = [] //in case of failure

    for (let i = 0; i < files.length; i++) {

        const fileRef = storageRef.child(files[i].name)
        const uploadTask = fileRef.putFile(files[i].path)
        console.log(uploadTask)
        promises.push(uploadTask)

        // if (isChat) { //to cancel/pause/resume task
        //     files[i].uploadTask = uploadTask
        //     this.setState({ files })
        // }


        //     uploadTask.on('state_changed', function (snapshot) {
        //         var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        //         console.log('Upload file ' + i + ': ' + progress + '% done')
        //         if (!isChat) {
        //             files[i].progress = progress / 100
        //             this.setState({ files })
        //         }
        //     }.bind(this))

        //     uploadTask.then(async (result) => {
        //         console.log('result', result)
        //         const url = await storageRef.child(files[i].name).getDownloadURL()
        //         urls.push(url)
        //     })
    }

    // return Promise.all(promises)
    //     .then(async (results) => {

    //         //Build output files
    //         for (let i = 0; i < results.length; i++) {
    //             const downloadURL = await storageRef.child(files[i].name).getDownloadURL()
    //             const { name, size, contentType } = results[i].metadata
    //             const attachedFile = { downloadURL, name, size, contentType }

    //             if (isChat) {
    //                 attachedFile.messageId = files[i].messageId
    //                 //attachedFile.uploadTask =  files[i].uploadTask
    //             }

    //             attachedFiles.push(attachedFile)
    //         }

    //         this.setState({ attachedFiles })
    //         return true
    //     })
    //     .catch(async err => {
    //         console.error(err)
    //         if (this.isEdit)
    //             this.title = 'Modifier le projet'
    //         else
    //             this.title = 'Nouveau projet'

    //         setToast(this, 'e', 'Erreur lors du téléchargement des fichiers, veuillez réessayer.')

    //         //Delete uploaded files (in this case not all files were uploaded)
    //         for (let i = 0; i < urls.length; i++) {
    //             //Delete files from Firebase storage
    //             firebase.storage().refFromURL(urls[i]).delete()

    //             //Delete failed messages
    //             if (isChat) {
    //                 await db.collection('Chats').doc(chatId).collection('Messages').doc(attachedFiles[i].messageId).delete() //#task: set status to uploadFailed to allow user to retry
    //                 // await db.collection('Chats').doc(chatId).set(latestMsg, { merge: true }) //#task: keep previous last message to be able to restore it
    //                 this.setState({ imageSource: '', videoSource: '', file: {} })
    //             }
    //         }

    //         return false
    //     })
}


//Finally not used in chat
export async function uploadFile(attachment, storageRef, showProgress) {

    const uploadTask = storageRef.putFile(attachment.path)

    const promise = new Promise((resolve, reject) => {
        uploadTask.on('state_changed', async function (tasksnapshot) {
            var progress = Math.round((tasksnapshot.bytesTransferred / tasksnapshot.totalBytes) * 100)
            console.log('Upload attachment ' + progress + '% done')

            if (showProgress) {
                attachment.progress = progress / 100
                this.setState({ attachment })
            }

        }.bind(this))

        //#task: can be canceled

        uploadTask.then(async (res) => {
            attachment.downloadURL = await storageRef.getDownloadURL()
            resolve(attachment)
        })
            .catch(err => {
                reject('failure')
            })
    })

    return promise
}


export async function uploadTask(uploadTask) {

    const promise = new Promise((resolve, reject) => {
        uploadTask.on('state_changed', async function (tasksnapshot) {
            var progress = Math.round((tasksnapshot.bytesTransferred / tasksnapshot.totalBytes) * 100)
            console.log('Upload attachment ' + progress + '% done')

            if (showProgress) {
                attachment.progress = progress / 100
                this.setState({ attachment })
            }

        }.bind(this))

        //#task: can be canceled

        uploadTask.then(async (res) => {
            attachment.downloadURL = await storageRef.getDownloadURL()
            resolve(attachment)
        })
            .catch(err => {
                reject('failure')
            })
    })

    return promise
}
