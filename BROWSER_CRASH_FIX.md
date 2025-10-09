# Browser Crash Fix - Emergency Response

**Date:** January 7, 2025  
**Issue:** Browser crashes when loading http://localhost:8083

---

## IMMEDIATE FIX APPLIED

### 1. Disabled StatusBanner ✅
**File:** `src/App.tsx` (line 145)  
**Change:** Commented out `<StatusBanner />`

```typescript
// Before:
<StatusBanner />

// After:
{/* <StatusBanner /> */}
```

**Reason:** StatusBanner often causes infinite re-renders if it has real-time subscriptions

---

## LIKELY CAUSES

### 1. Infinite useEffect Loop
**Symptoms:**
- Browser becomes unresponsive
- High CPU usage
- Memory spikes

**Common Culprits:**
- Missing dependencies in useEffect
- State updates inside useEffect without conditions
- Real-time subscriptions that re-subscribe

### 2. Memory Leak
**Symptoms:**
- Browser slows down over time
- Eventually crashes
- High memory usage in dev tools

**Common Culprits:**
- Unsubscribed Supabase subscriptions
- setInterval/setTimeout not cleared
- Event listeners not removed

### 3. Excessive API Calls
**Symptoms:**
- Network tab shows hundreds of requests
- Browser freezes
- Server overload

**Common Culprits:**
- Real-time monitoring too aggressive
- Multiple polling loops
- Missing request throttling

---

## TESTING STEPS

### Test 1: Basic Load (StatusBanner Disabled)
1. Clear browser cache (Ctrl+Shift+Delete)
2. Open new incognito window
3. Navigate to http://localhost:8083
4. Monitor browser task manager (Shift+Esc in Chrome)

**Expected:** Page should load without crashing  
**If passes:** StatusBanner was the issue  
**If fails:** Continue to Test 2

### Test 2: Disable NavigationOptimizer
Edit `src/App.tsx` line 144:
```typescript
{/* <MemoizedNavigationOptimizer /> */}
```

Test again. If passes, NavigationOptimizer is the issue.

### Test 3: Disable Real-Time Monitoring
Edit `src/lib/real-time-monitoring.ts` line 96:
```typescript
// Comment out the setInterval
// this.checkInterval = setInterval(async () => {
//   await this.performHealthChecks();
// }, 30000);
```

### Test 4: Disable WorkflowProvider
Edit `src/App.tsx`:
```typescript
{/* <WorkflowProvider> */}
  <MemoizedToaster />
  <MemoizedSonner />
  {/* ... routes ... */}
{/* </WorkflowProvider> */}
```

---

## COMPONENTS TO CHECK

### High Risk Components (Likely Causes)
1. **StatusBanner** ✅ DISABLED
   - `src/components/StatusBanner.tsx`
   - Check for useEffect loops

2. **NavigationOptimizer**
   - `src/components/NavigationOptimizer.tsx`
   - Check for excessive re-renders

3. **AuthProvider**
   - `src/contexts/AuthContext.tsx`
   - Check for subscription leaks

4. **WorkflowProvider**
   - `src/components/real-workflows/WorkflowIntegration.tsx`
   - Check for real-time subscriptions

### Medium Risk Components
5. **RealTimeMonitoringService**
   - `src/lib/real-time-monitoring.ts`
   - Currently polls every 30 seconds (reasonable)

6. **NotificationService**
   - Check for polling or subscriptions

7. **PerformanceMonitor**
   - Check if running on every render

---

## QUICK DIAGNOSTIC COMMANDS

### Check Browser Console
```javascript
// Run in browser console
performance.memory.usedJSHeapSize / 1048576 + ' MB'

// Check active intervals
console.log('Intervals:', setInterval.length);

// Check active event listeners
getEventListeners(window);
```

### Check Network Activity
1. Open DevTools → Network tab
2. Count requests per second
3. Look for requests in a loop

### Check React DevTools
1. Install React DevTools extension
2. Go to Profiler tab
3. Record a session
4. Look for components rendering 100+ times

---

## PERMANENT FIXES

### Fix 1: Add useEffect Cleanup
```typescript
useEffect(() => {
  const subscription = supabase
    .channel('changes')
    .on('*', handleChange)
    .subscribe();
  
  return () => {
    subscription.unsubscribe(); // CRITICAL
  };
}, []);
```

### Fix 2: Add Dependency Arrays
```typescript
// BAD - infinite loop
useEffect(() => {
  setCount(count + 1);
}); // No dependency array

// GOOD
useEffect(() => {
  setCount(c => c + 1);
}, []); // Empty array = run once
```

### Fix 3: Throttle/Debounce
```typescript
import { debounce } from 'lodash';

const debouncedUpdate = debounce(() => {
  // Expensive operation
}, 300);
```

### Fix 4: Use AbortController
```typescript
useEffect(() => {
  const controller = new AbortController();
  
  fetch('/api/data', { signal: controller.signal })
    .then(handleData);
  
  return () => controller.abort();
}, []);
```

---

## IF STILL CRASHING

### Nuclear Option: Minimal App
Create `src/App-minimal.tsx`:

```typescript
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <div>
        <h1>StratusConnect - Minimal Mode</h1>
        <p>If you see this, the crash is in a provider or wrapper component.</p>
      </div>
    </BrowserRouter>
  );
}
```

Swap in `src/main.tsx`:
```typescript
import App from './App-minimal';
```

Then add components back one by one until it crashes.

---

## MONITORING WHILE TESTING

### Terminal Command
```bash
# Watch dev server logs
npm run dev

# In another terminal, watch memory
while true; do echo "$(date): $(ps aux | grep node | awk '{sum+=$6} END {print sum/1024 " MB"}')"; sleep 2; done
```

### Browser DevTools
1. Open Performance Monitor (Ctrl+Shift+P → "Performance Monitor")
2. Watch:
   - CPU usage
   - JS heap size
   - DOM nodes
   - Event listeners

---

## NEXT STEPS

1. Test with StatusBanner disabled (DONE)
2. Report if browser still crashes
3. If not crashing, investigate StatusBanner component
4. If still crashing, disable NavigationOptimizer
5. Continue systematic elimination

---

## PREVENTATIVE MEASURES

### Add to All Providers
```typescript
useEffect(() => {
  console.log('Provider mounted');
  return () => console.log('Provider unmounted');
}, []);
```

### Add Performance Monitoring
```typescript
if (import.meta.env.DEV) {
  const renderCount = useRef(0);
  renderCount.current++;
  if (renderCount.current > 100) {
    console.error('Component rendered over 100 times!', Component.name);
  }
}
```

---

**Status:** StatusBanner disabled, awaiting user test  
**Next:** Check if browser still crashes  
**Emergency Contact:** See COMPLETE_AUDIT_SUMMARY.md for full system documentation

