import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { playSound } from '../../../utils/soundManager';
import ScreenTemplate from '../../ui/ScreenTemplate';

interface MapsModuleProps {
  onGoHome: () => void;
}

export default function MapsModule({ onGoHome }: MapsModuleProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationHistory, setLocationHistory] = useState<Location.LocationObject[]>([]);
  const [targetReached, setTargetReached] = useState(false);

  // Target coordinates (example: somewhere in the world)
  const TARGET_LAT = 40.7128; // New York City
  const TARGET_LON = -74.0060;
  const TARGET_RADIUS = 1000; // 1km radius

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status === 'granted') {
        getCurrentLocation();
      } else {
        setErrorMsg('Permission to access location was denied');
      }
    } catch (error) {
      console.error('Failed to get location permission:', error);
      setErrorMsg('Failed to get location permission');
    }
  };

  const getCurrentLocation = async () => {
    playSound('ui_button_tap');
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location);
      checkTargetReached(location);
    } catch (error) {
      console.error('Failed to get current location:', error);
      setErrorMsg('Failed to get current location');
    }
  };

  const startLocationTracking = async () => {
    if (!hasPermission) return;

    playSound('ui_button_tap');
    try {
      setIsTracking(true);
      
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          setLocation(location);
          setLocationHistory(prev => [...prev, location]);
          checkTargetReached(location);
        }
      );

      return () => {
        locationSubscription.remove();
        setIsTracking(false);
      };
    } catch (error) {
      console.error('Failed to start location tracking:', error);
      setIsTracking(false);
    }
  };

  const stopLocationTracking = () => {
    playSound('ui_button_tap');
    setIsTracking(false);
  };

  const checkTargetReached = (currentLocation: Location.LocationObject) => {
    const distance = calculateDistance(
      currentLocation.coords.latitude,
      currentLocation.coords.longitude,
      TARGET_LAT,
      TARGET_LON
    );
    
    setTargetReached(distance <= TARGET_RADIUS);
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const getDistanceToTarget = (): number => {
    if (!location) return 0;
    return calculateDistance(
      location.coords.latitude,
      location.coords.longitude,
      TARGET_LAT,
      TARGET_LON
    );
  };

  return (
    <ScreenTemplate title="MAPS" titleColor="purple" onGoHome={onGoHome}>
      {hasPermission === null ? (
        <View className="flex-1 p-5 justify-center">
          <Text className="text-purple-400 text-center text-base mb-2">Requesting location permission...</Text>
        </View>
      ) : hasPermission === false ? (
        <View className="flex-1 p-5 justify-center">
          <Text className="text-purple-400 text-center text-base mb-2">Location access denied</Text>
          <Text className="text-purple-400 text-center text-base mb-2">Please grant location permissions</Text>
        </View>
      ) : (
        <View className="flex flex-col space-y-4">
          {/* Current Location */}
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">CURRENT LOCATION</Text>
            {location ? (
              <View>
                <Text className="text-purple-400 text-lg font-mono">
                  Lat: {location.coords.latitude.toFixed(6)}
                </Text>
                <Text className="text-purple-400 text-lg font-mono">
                  Lon: {location.coords.longitude.toFixed(6)}
                </Text>
                <Text className="text-gray-300 text-sm font-mono mt-2">
                  Accuracy: ±{location.coords.accuracy?.toFixed(1)}m
                </Text>
              </View>
            ) : (
              <Text className="text-gray-600 font-mono">No location data</Text>
            )}
          </View>

          {/* Target Location */}
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">TARGET LOCATION</Text>
            <Text className="text-purple-400 text-lg font-mono">
              Lat: {TARGET_LAT.toFixed(6)}
            </Text>
            <Text className="text-purple-400 text-lg font-mono">
              Lon: {TARGET_LON.toFixed(6)}
            </Text>
            <Text className="text-gray-300 text-sm font-mono mt-2">
              Radius: {TARGET_RADIUS}m
            </Text>
          </View>

          {/* Distance to Target */}
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">DISTANCE TO TARGET</Text>
            <Text className="text-purple-400 text-2xl font-mono text-center">
              {location ? `${(getDistanceToTarget() / 1000).toFixed(2)} km` : '--'}
            </Text>
          </View>

          {/* Location Controls */}
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">LOCATION CONTROLS</Text>
            <View className="flex flex-row justify-center space-x-4">
              <TouchableOpacity
                onPress={getCurrentLocation}
                className="bg-purple-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white text-center font-mono">Get Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={isTracking ? stopLocationTracking : startLocationTracking}
                className={`px-4 py-2 rounded-lg ${isTracking ? 'bg-red-600' : 'bg-green-600'}`}
              >
                <Text className="text-white text-center font-mono">
                  {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location History */}
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">LOCATION HISTORY</Text>
            <Text className="text-gray-300 text-sm font-mono text-center">
              {locationHistory.length} locations tracked
            </Text>
          </View>
        </View>
      )}
    </ScreenTemplate>
  );
} 