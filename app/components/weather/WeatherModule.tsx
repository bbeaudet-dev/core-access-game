import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import HomeButton from '../ui/HomeButton';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';

interface WeatherData {
  temperature: number;
  humidity: number;
  pressure: number;
  condition: string;
  icon: string;
  feelsLike: number;
  windSpeed: number;
  visibility: number;
}

interface WeatherModuleProps {
  onGoHome: () => void;
}

export default function WeatherModule({ onGoHome }: WeatherModuleProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forecast, setForecast] = useState<WeatherData[]>([]);

  useEffect(() => {
    loadWeatherData();
  }, []);

  const loadWeatherData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate weather data loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock weather data
      const mockWeather: WeatherData = {
        temperature: 22.5,
        humidity: 65,
        pressure: 1013.2,
        condition: 'Partly Cloudy',
        icon: '⛅',
        feelsLike: 24.1,
        windSpeed: 12.3,
        visibility: 10.2
      };
      
      const mockForecast: WeatherData[] = [
        { ...mockWeather, temperature: 25.2, condition: 'Sunny', icon: '☀️' },
        { ...mockWeather, temperature: 18.7, condition: 'Rainy', icon: '🌧️' },
        { ...mockWeather, temperature: 20.1, condition: 'Cloudy', icon: '☁️' },
        { ...mockWeather, temperature: 23.8, condition: 'Clear', icon: '🌙' },
        { ...mockWeather, temperature: 21.4, condition: 'Partly Cloudy', icon: '⛅' }
      ];
      
      setWeather(mockWeather);
      setForecast(mockForecast);
    } catch (err) {
      setError('Failed to load weather data');
    } finally {
      setLoading(false);
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return 'text-red-400';
    if (temp >= 20) return 'text-orange-400';
    if (temp >= 10) return 'text-yellow-400';
    if (temp >= 0) return 'text-blue-400';
    return 'text-cyan-400';
  };

  const getHumidityColor = (humidity: number) => {
    if (humidity >= 80) return 'text-blue-400';
    if (humidity >= 60) return 'text-green-400';
    if (humidity >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="WEATHER" color="cyan" />
          
          {loading ? (
            <View className="flex-1 p-5 justify-center">
              <Text className="text-cyan-400 text-center text-base mb-2">Loading weather data...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 p-5 justify-center">
              <Text className="text-red-400 text-center text-base mb-2">{error}</Text>
              <TouchableOpacity
                onPress={loadWeatherData}
                className="bg-cyan-600 px-4 py-2 rounded-lg mt-4 mx-auto"
              >
                <Text className="text-white text-center font-mono">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : weather ? (
            <View className="flex flex-col space-y-4">
              {/* Current Weather */}
              <View className="bg-gray-900 p-6 rounded-lg">
                <Text className="text-gray-400 text-sm font-mono mb-2">CURRENT WEATHER</Text>
                <View className="flex flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className={`text-4xl font-mono ${getTemperatureColor(weather.temperature)}`}>
                      {weather.temperature.toFixed(1)}°C
                    </Text>
                    <Text className="text-gray-300 text-sm font-mono">
                      Feels like {weather.feelsLike.toFixed(1)}°C
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-6xl mb-2">{weather.icon}</Text>
                    <Text className="text-cyan-400 text-sm font-mono text-center">
                      {weather.condition}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Weather Details */}
              <View className="bg-gray-900 p-6 rounded-lg">
                <Text className="text-gray-400 text-sm font-mono mb-4">WEATHER DETAILS</Text>
                <View className="space-y-3">
                  <View className="flex flex-row justify-between">
                    <Text className="text-gray-300 font-mono">Humidity:</Text>
                    <Text className={`font-mono ${getHumidityColor(weather.humidity)}`}>
                      {weather.humidity}%
                    </Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-gray-300 font-mono">Pressure:</Text>
                    <Text className="text-cyan-400 font-mono">
                      {weather.pressure.toFixed(1)} hPa
                    </Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-gray-300 font-mono">Wind Speed:</Text>
                    <Text className="text-cyan-400 font-mono">
                      {weather.windSpeed.toFixed(1)} km/h
                    </Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-gray-300 font-mono">Visibility:</Text>
                    <Text className="text-cyan-400 font-mono">
                      {weather.visibility.toFixed(1)} km
                    </Text>
                  </View>
                </View>
              </View>

              {/* 5-Day Forecast */}
              <View className="bg-gray-900 p-6 rounded-lg">
                <Text className="text-gray-400 text-sm font-mono mb-4">5-DAY FORECAST</Text>
                <View className="space-y-3">
                  {forecast.map((day, index) => (
                    <View key={index} className="flex flex-row justify-between items-center py-2 border-b border-gray-700">
                      <View className="flex flex-row items-center">
                        <Text className="text-2xl mr-3">{day.icon}</Text>
                        <View>
                          <Text className="text-gray-300 font-mono text-sm">
                            Day {index + 1}
                          </Text>
                          <Text className="text-gray-500 font-mono text-xs">
                            {day.condition}
                          </Text>
                        </View>
                      </View>
                      <Text className={`font-mono ${getTemperatureColor(day.temperature)}`}>
                        {day.temperature.toFixed(1)}°C
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Refresh Button */}
              <View className="bg-gray-900 p-6 rounded-lg">
                <Text className="text-gray-400 text-sm font-mono mb-2">CONTROLS</Text>
                <View className="flex flex-row justify-center">
                  <TouchableOpacity
                    onPress={loadWeatherData}
                    className="bg-cyan-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white text-center font-mono">Refresh Weather</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null}
        </View>
        
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 