import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import VideoPlayer from 'react-native-video-controls';

export default class template extends Component {
    constructor(props) {
        super(props)
        this.state = {
            a: ''
        }
    }

    render() {
        return (
            <View style={{ flex: 1, width: 200, height: 200 }}>
                <VideoPlayer
                    //source={{ uri: 'https://vjs.zencdn.net/v/oceans.mp4' }}
                    source={require('./dogs.mp4')}
                    navigator={this.props.navigator}
                    pause={true}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

