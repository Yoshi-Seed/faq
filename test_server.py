from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys

class MyHandler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        sys.stdout.write(f"{self.log_date_time_string()} - {format%args}\n")
        sys.stdout.flush()

if __name__ == "__main__":
    server = HTTPServer(('0.0.0.0', 3001), MyHandler)
    print("Server running on port 3001")
    sys.stdout.flush()
    server.serve_forever()
