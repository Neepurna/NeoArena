#!/usr/bin/env python3
"""
Simple HTTP server for testing NeoArena MVP locally.
Run this in the neoarena-mvp directory.
"""

import http.server
import socketserver
import webbrowser
import os

PORT = 5173

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cross-Origin-Embedder-Policy', 'cross-origin')
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        super().end_headers()

if __name__ == "__main__":
    # Change to the script's directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 NeoArena MVP server running at http://localhost:{PORT}")
        print(f"📱 Open http://localhost:{PORT}/quiz.html to test the quiz")
        print("🔗 Make sure MetaMask is connected to Sepolia testnet")
        print("⏹️  Press Ctrl+C to stop the server")
        
        # Automatically open browser
        webbrowser.open(f'http://localhost:{PORT}/quiz.html')
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n✅ Server stopped")
