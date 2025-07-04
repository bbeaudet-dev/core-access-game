# 🎵 Sound Integration Examples

## Adding Sounds to Your App Components

### 1. HomeButton with Click Sound

```typescript
// In HomeButton.tsx
import { playSound } from "../../utils/soundManager";

const handlePressIn = () => {
  if (!active) return;

  // Play click sound
  playSound("ui_click");

  // ... rest of press logic
};
```

### 2. App Icons with Launch Sound

```typescript
// In AppIcon.tsx
import { playSound } from "../utils/soundManager";

const handlePress = () => {
  playSound("ui_app_launch");
  onPress();
};
```

### 3. Module Unlock Sound

```typescript
// In PuzzleContext.tsx
import { playSound } from "../utils/soundManager";

const completePuzzle = (puzzleId: string) => {
  // ... puzzle completion logic

  // Play unlock sound
  playSound("ui_unlock");
};
```

### 4. Navigation Sounds

```typescript
// In your navigation logic
import { playSound } from "../utils/soundManager";

const goHome = () => {
  playSound("ui_home");
  // ... navigation logic
};

const goBack = () => {
  playSound("ui_back");
  // ... navigation logic
};
```

### 5. Sensor Activation Sounds

```typescript
// In sensor modules (gyro, accelerometer, etc.)
import { playSound } from "../../../utils/soundManager";

const startSensor = () => {
  playSound("sensor_activate");
  // ... sensor start logic
};
```

### 6. Success/Error Feedback

```typescript
// In any module with success/error states
import { playSound } from "../../utils/soundManager";

const handleSuccess = () => {
  playSound("ui_success");
  // ... success logic
};

const handleError = () => {
  playSound("ui_error");
  // ... error logic
};
```

## Quick Implementation Checklist

- [ ] Add `playSound('ui_click')` to HomeButton press
- [ ] Add `playSound('ui_app_launch')` to AppIcon press
- [ ] Add `playSound('ui_unlock')` to puzzle completions
- [ ] Add `playSound('ui_home')` to home navigation
- [ ] Add `playSound('ui_back')` to back navigation
- [ ] Add `playSound('sensor_activate')` to sensor modules
- [ ] Add `playSound('ui_success')` to successful actions
- [ ] Add `playSound('ui_error')` to error states

## Volume Control

```typescript
// Adjust volume for different sound types
playSound("ui_click", 0.8); // UI sounds at 80%
playSound("ui_unlock", 1.0); // Important sounds at 100%
playSound("ambient_hum", 0.3); // Ambient sounds at 30%
```

## Testing Sounds

```typescript
// Add this to any component for testing
import { playSound } from '../utils/soundManager';

// Test button
<TouchableOpacity onPress={() => playSound('ui_click')}>
  <Text>Test Click Sound</Text>
</TouchableOpacity>
```
