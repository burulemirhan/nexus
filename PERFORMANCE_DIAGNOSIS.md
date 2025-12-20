# Performance Diagnosis Report
## Website: nexusbiotech.org

### Critical Issues (High Impact on Performance)

#### 1. **Video Event Listeners Not Cleaned Up** 🔴 CRITICAL
**Location**: `App.tsx` (lines 142-143), `ServicePage.tsx` (lines 243-244), `DefenseSpace.tsx` (lines ~203-204)
**Issue**: Video elements add `addEventListener('pause', ensurePlaying)` and `addEventListener('ended', ...)` inside ref callbacks. These listeners are never removed, causing memory leaks and potential performance degradation on route changes.
**Impact**: Memory leak, event listener accumulation, potential CPU usage from orphaned listeners
**Expected Fix**: Store event listener references and remove them in cleanup or useEffect cleanup

#### 2. **Large Video File Sizes** 🔴 CRITICAL  
**Location**: `public/assets/videos/bg.mp4` (16MB), `public/assets/videos/moon.mp4` (4.4MB)
**Issue**: Videos are very large for web delivery. Even with metadata preload, decoding and playback are expensive operations.
**Impact**: Slow initial page load, high bandwidth usage, expensive decode operations, battery drain on mobile
**Expected Fix**: Re-encode videos with lower bitrate, resolution appropriate for viewport, use WebM format, or serve different sizes based on viewport

#### 3. **Multiple Layout-Forcing scrollTop Operations** 🟠 HIGH
**Location**: `ServicePage.tsx` (lines 73-108), `ScrollToTop.tsx` (lines 10-25)
**Issue**: Multiple `window.scrollTo()`, `document.documentElement.scrollTop`, `document.body.scrollTop` reads/writes force synchronous layout recalculation. Some in `useLayoutEffect` and some in `useEffect`, causing multiple layout passes.
**Impact**: Layout thrashing, forced synchronous layouts, scroll jank during route transitions
**Expected Fix**: Consolidate to single operation, use Lenis exclusively for scroll management, remove duplicate scroll resets

#### 4. **Expensive mix-blend-mode Operations** 🟠 HIGH
**Location**: `App.tsx` (line 180: `mix-blend-overlay`), `ServicePage.tsx` (line 272: `mix-blend-multiply`)
**Issue**: `mix-blend-mode` forces expensive compositing operations on every frame. Applied to full-viewport overlays with noise textures and video overlays.
**Impact**: High GPU compositing cost, reduced FPS during scroll, battery drain
**Expected Fix**: Remove blend modes, use solid rgba backgrounds with opacity instead

#### 5. **DefenseSpace Text Scrambling Animation Memory Leak** 🟠 HIGH
**Location**: `DefenseSpace.tsx` (lines 24-55)
**Issue**: `setInterval` creates nested intervals - one interval creates another `scrambleInterval` inside `runAnimationOnce()`, but cleanup only removes the outer `loop` interval. If component unmounts during scramble, `scrambleInterval` leaks.
**Impact**: Memory leak, orphaned intervals continuing to run, unnecessary setState calls
**Expected Fix**: Store interval ref and clear all intervals in cleanup, use single interval with state machine

#### 6. **Video willChange Not Removed After Load** 🟡 MEDIUM
**Location**: `App.tsx` (line 117: `willChange: 'transform'`), `DefenseSpace.tsx` (line 182: `willChange: 'auto'`)
**Issue**: `willChange` is set on video elements but never removed after video loads. This keeps elements in compositing layer unnecessarily.
**Impact**: Unnecessary GPU compositing layers, memory overhead
**Expected Fix**: Remove `willChange` after video `loadeddata` event

---

### Rendering & Compositing Issues

#### 7. **SVG Filter Drop-Shadow on Animated Elements** 🟠 HIGH
**Location**: `DataFlowAnimation.tsx` (lines 54, 167, 213)
**Issue**: SVG `filter: drop-shadow()` applied to animated SVG elements. Filters are expensive operations that recalculate on every animation frame.
**Impact**: High paint cost, reduced FPS during animations, GPU overhead
**Expected Fix**: Use CSS shadows instead of SVG filters, or remove shadows from animated elements

#### 8. **Content-Visibility with Potentially Wrong Intrinsic Size** 🟡 MEDIUM
**Location**: `index.css` (line 177-178)
**Issue**: `content-visibility: auto` with `contain-intrinsic-size: auto 500px` on all sections. If section heights vary significantly, this can cause layout shift.
**Impact**: Layout shift (CLS), incorrect scrollbar calculation, visual jumps
**Expected Fix**: Remove content-visibility from above-fold sections, or calculate accurate intrinsic sizes per section

#### 9. **transition-all Usage** 🟡 MEDIUM
**Location**: Multiple components (Technology.tsx, Services.tsx, DataFlowAnimation.tsx, etc.)
**Issue**: `transition-all` animates all CSS properties, including expensive ones like `box-shadow`, `filter`, `width`, `height` that trigger layout/paint.
**Impact**: Unnecessary layout/paint operations during transitions
**Expected Fix**: Specify only `transform` and `opacity` in transition-property

#### 10. **Preloader Canvas Runs Even When Not Visible** 🟡 MEDIUM
**Location**: `Preloader.tsx` (lines 161-214)
**Issue**: Canvas animation loop continues running `requestAnimationFrame` even when preloader is not visible (after completion). Should stop animation when `isVisible` becomes false.
**Impact**: Unnecessary CPU/GPU usage, battery drain
**Expected Fix**: Check visibility before continuing animation loop, stop when `!isVisible`

#### 11. **Navbar Scroll Handler Missing Dependency** 🟡 MEDIUM
**Location**: `Navbar.tsx` (line 61: `}, [isMenuOpen])`)
**Issue**: `handleScroll` uses `isVisible` state (line 44) but it's not in dependency array. Should be stable but could cause stale closure if refactored.
**Impact**: Potential stale closure bug, though currently works due to closure
**Expected Fix**: Include `isVisible` in dependencies or use ref to avoid dependency

---

### Asset & Loading Issues

#### 12. **Large Bundle Size** 🟡 MEDIUM
**Location**: Build output shows `index-*.js` is ~274KB (78KB gzipped)
**Issue**: Main bundle is large. React 19 and all dependencies bundled together.
**Impact**: Slow initial load, parse/compile time, Time to Interactive delay
**Expected Fix**: Code splitting for routes, lazy load components, tree shaking optimization

#### 13. **No Image Size Optimization Check** 🟡 MEDIUM
**Location**: All AVIF images in `public/assets/images/`
**Issue**: Images use `transform: scale(1.15)` zoom but no verification if source images are appropriately sized. Large source images scaled down waste bandwidth.
**Impact**: Unnecessary bandwidth usage, decode cost
**Expected Fix**: Verify image dimensions match display size + 15%, optimize source images

#### 14. **External Video Fallback URL** 🟡 MEDIUM
**Location**: `App.tsx` (line 170)
**Issue**: External Pexels video URL as fallback. External resource adds latency and dependency.
**Impact**: Slower fallback loading, external dependency risk
**Expected Fix**: Use local fallback or remove if not needed

---

### JavaScript Performance Issues

#### 15. **Lenis requestAnimationFrame Always Running** 🟡 MEDIUM
**Location**: `App.tsx` (lines 45-50), `ServicePage.tsx` (lines 142-151)
**Issue**: Lenis `raf` function runs in continuous `requestAnimationFrame` loop even when page is not scrolling. Lenis should handle this internally, but explicit loop ensures it's always active.
**Impact**: Constant CPU usage, unnecessary animation frame calls
**Expected Fix**: This is actually correct for Lenis - it needs continuous RAF. But verify if Lenis can optimize internally.

#### 16. **DefenseSpace Star Positions Recalculated** 🟢 LOW
**Location**: `DefenseSpace.tsx` (lines 58-66)
**Issue**: Star positions use `useMemo` with empty deps, but `Math.random()` means positions change on every component mount. Not truly memoized.
**Impact**: Minor - positions recalculated unnecessarily, but minimal performance impact
**Expected Fix**: Use seeded random or store positions in ref

#### 17. **AnimatedValue Component Re-renders on Every Frame** 🟡 MEDIUM
**Location**: `AnimatedValue.tsx` (line 52: `setDisplayValue(scrambled)`)
**Issue**: Component calls `setDisplayValue` on every animation frame during scramble animation, causing React re-render 60 times per second.
**Impact**: High React reconciliation cost, potential main thread blocking
**Expected Fix**: Throttle updates, or use ref + direct DOM manipulation for high-frequency updates

---

### CSS Performance Issues

#### 18. **CSS contain-intrinsic-size May Be Inaccurate** 🟡 MEDIUM
**Location**: `index.css` (line 178)
**Issue**: All sections use `contain-intrinsic-size: auto 500px` but sections have varying heights (Hero is full viewport, others are different).
**Impact**: Layout shift when sections become visible, incorrect scrollbar height
**Expected Fix**: Remove or calculate accurate sizes per section type

#### 19. **will-change on Navbar** 🟡 MEDIUM
**Location**: `index.css` (line 186)
**Issue**: `will-change: transform` on navbar is set permanently. Should be removed after navbar animations complete or use only when animating.
**Impact**: Keeps navbar in compositing layer permanently, memory overhead
**Expected Fix**: Add/remove `will-change` dynamically when navbar is animating

#### 20. **Multiple Transform Declarations** 🟢 LOW
**Location**: `DefenseSpace.tsx` (lines 85, 88, 157 - multiple `transform: translateZ(0)`)
**Issue**: Several elements have explicit `transform: translateZ(0)` inline styles. Some redundancy with CSS.
**Impact**: Minor - creates compositing layers but appropriate for animated elements
**Expected Fix**: Consolidate to CSS classes, remove redundant inline styles

---

### Architecture Issues

#### 21. **No Route-Based Code Splitting** 🟡 MEDIUM
**Location**: `App.tsx`, `index.tsx` (all components imported statically)
**Issue**: All components loaded upfront. Service pages, Technology section, etc. all in initial bundle.
**Impact**: Large initial bundle, slower Time to Interactive
**Expected Fix**: Lazy load route components, lazy load heavy components like DataFlowAnimation

#### 22. **ServicePage Duplicate Lenis Instance** 🟢 LOW
**Location**: `ServicePage.tsx` (lines 129-179)
**Issue**: ServicePage creates its own Lenis instance. If App.tsx also creates one (for main page), there could be conflicts (though App.tsx only runs on main route).
**Impact**: Potential conflict if both run, but currently separated by routes
**Expected Fix**: Verify no conflicts, consider shared Lenis instance via context

---

### Summary by Priority

**🔴 CRITICAL (Fix Immediately)**:
1. Video event listeners not cleaned up
2. Large video file sizes (16MB + 4.4MB)
3. Multiple layout-forcing scrollTop operations
4. Expensive mix-blend-mode operations
5. DefenseSpace text scrambling memory leak

**🟠 HIGH (Fix Soon)**:
6. SVG filter drop-shadow on animations
7. Video willChange not removed after load

**🟡 MEDIUM (Optimize When Possible)**:
8. Content-visibility intrinsic size accuracy
9. transition-all usage
10. Preloader canvas running when invisible
11. Navbar scroll handler dependencies
12. Large bundle size
13. Image size optimization
14. External video fallback
15. Lenis RAF always running (verify if needed)
16. AnimatedValue high-frequency re-renders
17. CSS contain-intrinsic-size accuracy
18. will-change on navbar permanently
19. No route-based code splitting

**🟢 LOW (Nice to Have)**:
20. Multiple transform declarations
21. DefenseSpace star positions recalculation
22. ServicePage duplicate Lenis instance

---

### Expected Performance Improvements After Fixes

- **Memory Usage**: 20-30% reduction (event listener cleanup, interval cleanup)
- **Initial Load Time**: 30-50% faster (video optimization, code splitting)
- **Scroll FPS**: 55-60fps (removing mix-blend-mode, fixing layout thrash)
- **Time to Interactive**: 20-40% faster (smaller bundle, lazy loading)
- **Battery Life (Mobile)**: Improved (fewer continuous operations)
