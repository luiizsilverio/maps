import { useState, useEffect } from 'react';
import { Alert, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons';
import CarImg from './assets/car.png';
import { styles } from './styles';

type CoordsProps = {
  latitude: number;
  longitude: number;
}

const initialLocation: CoordsProps = {
  latitude: -22.9198944,
  longitude: -47.067326
}

export default function App() {
  const [currentLocation, setCurrentLocation] = useState<CoordsProps>(initialLocation);
  const [coords, setCoords] = useState<CoordsProps[]>([]);

  useEffect(() => {
    // Location.getCurrentPositionAsync;
    let subscription: Location.LocationSubscription;

    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        console.log(status)
        if (status !== 'granted') {
          Alert.alert("Habilite a permissão para obter a localização");
          return;
        }

        Location.watchPositionAsync({
          accuracy: Location.LocationAccuracy.High,
          timeInterval: 1000,
          distanceInterval: 1 // em metros
        }, (location) => {
          setCurrentLocation(location.coords);
          setCoords((prevState) => [...prevState, location.coords]);
        })
        .then(response => subscription = response);
      })

      return () => {
        if (subscription) {
          subscription.remove();
        }
      }

  }, [])

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: currentLocation?.latitude,
          longitude: currentLocation?.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        }}
      >
        <Marker
          coordinate={currentLocation}
        />

        {/* <Marker
          image={CarImg}
          coordinate={currentLocation}
        /> */}

        {/* <Marker
          coordinate={{
            latitude: -22.923,
            longitude: -47.067726,
          }}
        >
          <FontAwesome name="fa" size={36} color="red"  />
        </Marker> */}

        <Polyline
          coordinates={coords}
          strokeColor="blue"
          strokeWidth={6}
        />

      </MapView>
    </View>
  );
}

