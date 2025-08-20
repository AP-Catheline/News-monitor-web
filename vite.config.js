import { defineConfig } from 'vite';

export default defineConfig({
    // Enable HTTPS for camera access
    server: {
        https: false, // Set to true if you need HTTPS
        host: true, // Allow external connections
        port: 3000,
        open: true, // Auto-open browser
    },
    // Ensure proper MIME types for MediaPipe
    optimizeDeps: {
        exclude: ['@mediapipe/hands', '@mediapipe/camera_utils'],
    },
    build: {
        // Ensure compatibility with MediaPipe
        target: 'es2015',
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
});
