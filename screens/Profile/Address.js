import React from 'react';
import { StyleSheet, View, Dimensions, Alert } from 'react-native';
import Geocoder from 'react-native-geocoding'
import MapView, { Marker, ProviderPropType, PROVIDER_GOOGLE } from 'react-native-maps';

import AddressSearch from '../../components/AddressSearch'
import Appbar from '../../components/Appbar'
import Loading from "../../components/Loading"

import { db } from '../../firebase'
import * as theme from "../../core/theme"
import { constants } from '../../core/constants'
import { load } from '../../core/utils';

Geocoder.init("AIzaSyDKYloIbFHpaNh5QWGa7CWjKr8v-3aiu80", { language: "fr" })

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 43.184277; //Narbonne
const LONGITUDE = 3.003078;  //Narbonne
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01

class MarkerTypes extends React.Component {
    constructor(props) {
        super(props)
        //this.getCurrentPosition = this.getCurrentPosition.bind(this)
        this.onRegionChange = this.onRegionChange.bind(this)
        this.onChangePosition = this.onChangePosition.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.currentAddress = this.props.navigation.getParam('currentAddress', null)

        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            marker: {
                latitude: LATITUDE + SPACE,
                longitude: LONGITUDE + SPACE,
            },
            address: { description: '', place_id: '' },
            showInput: false,

            loading: false
        }
    }

    componentDidMount() {
        if (this.currentAddress)
            this.getCurrentPosition()
    }

    getCurrentPosition() {

        if (this.currentAddress.marker === '' || this.currentAddress.marker.longitude === '') return

        const marker = {
            latitude: Number(this.currentAddress.marker.latitude),
            longitude: Number(this.currentAddress.marker.longitude)
        }

        let region = marker
        region.latitudeDelta = 0.0143
        region.longitudeDelta = 0.0134

        const address = {
            description: this.currentAddress.description,
            place_id: this.currentAddress.place_id,
            marker
        }

        this.setState({ region, marker, address })
    }

    onRegionChange(region) {
        this.setState({ region })
    }

    handleSubmit() {
        if (this.state.loading) return

        load(this, true)

        const { address, marker } = this.state

        if (address.description === '') {
            load(this, false)
            Alert.alert('Veuillez choisir une adresse correcte.')
            return
        }

        address.marker = marker

        load(this, false)
        this.props.navigation.state.params.onGoBack(address)
        this.props.navigation.goBack()
    }

    onChangePosition(e) {
        const lat = e.nativeEvent.coordinate.latitude
        const lng = e.nativeEvent.coordinate.longitude

        Geocoder.from(lat, lng)
            .then(json => {
                var addressComponent = json.results[0]
                const address = {
                    description: addressComponent.formatted_address,
                    place_id: addressComponent.place_id
                }
                this.setState({ address })
            })
            .catch(error => console.warn(error))

        this.setState({ marker: e.nativeEvent.coordinate })
    }

    render() {
        let { address, showInput, loading } = this.state

        console.log(address.description)

        return (
            <View style={{ flex: 1 }}>

                {showInput ?
                    <AddressSearch
                        main={this}
                        handleSubmit={this.handleSubmit}
                        showInput={showInput}
                        hideInput={() => this.setState({ showInput: false })} />
                    :
                    <Appbar close={!loading} title titleText={address.description} check={!loading} handleSubmit={this.handleSubmit} search={!showInput && !loading} handleSearch={() => this.setState({ showInput: true })} />
                }

                {!loading ?
                    <View style={{ flex: 1 }}>
                        <MapView
                            provider={PROVIDER_GOOGLE}
                            style={{ flex: 1 }}
                            initialRegion={{
                                latitude: LATITUDE,
                                longitude: LONGITUDE,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }}
                            region={this.state.region}
                            onRegionChange={(region) => console.log(region)}
                            onRegionChangeComplete={(region) => this.setState({ region })}
                            ref={ref => this.map = ref}
                            onPress={e => this.onChangePosition(e)} //update marker
                        >
                            <Marker
                                coordinate={this.state.marker}
                                onDragEnd={(e) => this.onChangePosition(e)}
                                draggable>
                            </Marker>
                        </MapView>
                    </View>

                    :
                    <Loading size='large' />
                }

            </View>
        )
    }
}

MarkerTypes.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

export default MarkerTypes;