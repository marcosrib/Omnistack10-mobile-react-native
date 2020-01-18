import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';

// import { Container } from './styles';
import MapView, { Marker, Callout } from 'react-native-maps';
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

import api from '../services/api';
import { connect, disconnect } from '../services/socket';

export default function Main({ navigation }) {

    const [currentRegion, setCurrntRegion] = useState(null);

    const [devs, setDevs] = useState([]);
    const [tech, setTech] = useState('');

    useEffect(() => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync();
            if (granted) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                });
                const { latitude, longitude } = coords;

                setCurrntRegion({
                    latitude,
                    longitude,
                    latitudeDelta: 0.04,
                    longitudeDelta: 0.04
                })
            }
        }
        loadInitialPosition();
    })
    if (!currentRegion) {
        return null;
    }

    function setupWebsocket() {
        const { latitude, longitude } = currentRegion;
        connect(latitude,longitude,devs);
    }
    async function loadDevs() {


        const { latitude, longitude } = currentRegion;
        const res = await api.get('/search', {
            params: {
                latitude,
                longitude,
                techs: tech
            }
        })
        setDevs(res.data.devs);
        console.warn(res.data.devs);
        setupWebsocket();
    }

    function handleRegionChangend(region) {
        setCurrntRegion(region)
    }

    return (
        <>
            <MapView
                onRegionChangeComplete={handleRegionChangend}
                initialRegion={currentRegion}
                style={styles.map}
            >
                {devs.map(dev => (
                    <Marker coordinate={{ latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0] }}>
                        <Image style={styles.avatar} source={{ uri: dev.avatar_url }} />
                        <Callout onPress={() => {
                            navigation.navigate('Profile', { github_username: dev.github_username })
                        }}>
                            <View style={styles.callout}>
                                <Text style={styles.devName}>{dev.name}</Text>
                                <Text style={styles.devBio}>{dev.bio}</Text>
                                <Text style={styles.devTechs}>{dev.techs}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <View style={styles.searchForm}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar devs por techs"
                    placeholderTextColor="#999"
                    autoCapitalize="words"
                    autoCorrect={false}
                    onChangeText={setTech}
                    value={tech}
                />
                <TouchableOpacity onPress={() => loadDevs()} style={styles.loadButton}>
                    <MaterialIcons name="my-location" size={20} color='#fff' />
                </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    map: {
        flex: 1
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 4,
        borderWidth: 4,
        borderColor: '#fff'
    },
    callout: {
        width: 260,
    },
    devName: {
        fontWeight: 'bold',
        fontSize: 16
    },
    devBio: {
        color: '#666',
        marginTop: 5
    },
    devTechs: {
        marginTop: 5
    },
    searchForm: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 5,
        flexDirection: 'row'
    },
    searchInput: {
        flex: 1,
        height: 50,
        backgroundColor: "#fff",
        color: '#333',
        borderRadius: 25,
        paddingHorizontal: 20,
        fontSize: 16,
        elevation: 2
    },
    loadButton: {
        width: 50,
        height: 50,
        backgroundColor: '#be4dff',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    }

})
