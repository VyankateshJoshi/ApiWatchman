from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from sqlalchemy import and_
from models import Monitors, QueueItem
from database import db  # Import the Flask app instance
from app import app
from queue_repo import Queue
import time

class MonitorScheduler:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.queue = Queue()

    def add_monitor_to_queue(self, monitor):
        """Add the monitor to the queue."""
        data = f"Monitor {monitor.id} for path {monitor.path} with method {monitor.method}"
        self.queue.enqueue(data, monitor_id=monitor.id)

    def check_monitors(self):
        """Check if any monitor's current time - last_called_at > interval, and add to queue"""
        with app.app_context():  # Ensure the Flask app context is active
            current_time = datetime.now()

            # Find all monitors where current_time - last_called_at > interval
            monitors_to_queue = db.session.query(Monitors).filter(
                and_(
                    current_time - Monitors.last_called_at > Monitors.interval,
                )
            ).all()

            # Add monitors to queue
            for monitor in monitors_to_queue:
                print(f"Adding Monitor ID {monitor.id} to queue")
                self.add_monitor_to_queue(monitor)
                
                # Update last_called_at to current time after queuing
                monitor.last_called_at = current_time
                db.session.commit()

    def start_scheduler(self):
        """Start the scheduler to run check_monitors every second"""
        self.scheduler.add_job(self.check_monitors, 'interval', seconds=1)
        self.scheduler.start()
        print("Scheduler started...")

    def stop_scheduler(self):
        """Stop the scheduler"""
        self.scheduler.shutdown()

# Example usage:
if __name__ == "__main__":
    monitor_scheduler = MonitorScheduler()
    monitor_scheduler.start_scheduler()
    
    try:
        # Keep the script running to prevent the scheduler from shutting down
        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        # Safely stop the scheduler on exit
        monitor_scheduler.stop_scheduler()
