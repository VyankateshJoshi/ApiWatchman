import requests
from apscheduler.schedulers.background import BackgroundScheduler
from models import QueueItem, Monitors, Log
from database import db
from app import app
from datetime import datetime ,timedelta
import time

class QueueProcessor:
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        
    @staticmethod
    def interval_to_seconds(interval):
        """Convert a timedelta object to an integer representing total seconds."""
        if isinstance(interval, timedelta):
            return int(interval.total_seconds())
        else:
            raise ValueError("The provided interval is not of type 'timedelta'.")
    def process_queue(self):
        """Process items in the queue, make HTTP requests, and log results."""
        with app.app_context():  # Ensure the Flask app context is active
            try:
                # Get the oldest item from the queue
                item = db.session.query(QueueItem).order_by(QueueItem.inserted_at).with_for_update(skip_locked=True).first()
              
                if item:
                    # Get monitor details
                    monitor = db.session.query(Monitors).filter_by(id=item.monitor_id).first()
                    timeout = self.interval_to_seconds(monitor.timeout)
                    if monitor:
                        try:
                            # Make HTTP request
                            start_time = time.time() 
                            response = requests.request(
                                method=monitor.method,
                                url=monitor.path,
                                headers=monitor.headers,
                                params=monitor.query_params,
                                json=monitor.request_body,
                                timeout=timeout
                            )
                            end_time = time.time()
                            response_time = end_time - start_time
                            # Log the result
                            success = False 
                            if(response.status_code == 200)  :
                                success = True
                            else :
                                monitor.status = False 
                            log_entry = Log(
                                monitor_id=monitor.id,
                                response_status=response.status_code,
                                response_body=response.text,
                                success = success,
                                timestamp = datetime.now(),
                                response_time=response_time
                            )
                            db.session.add(log_entry)
                            
                            # Remove the item from the queue
                            db.session.delete(item)
                            
                            db.session.commit()
                            
                            print(f"Processed QueueItem ID {item.id} for Monitor ID {monitor.id}")
                        except Exception as e:
                            db.session.rollback()
                            print(f"Error processing QueueItem ID {item.id}: {e}")
                    else:
                        print(f"Monitor ID {item.monitor_id} not found")
                        db.session.delete(item)
                        db.session.commit()
            except Exception as e:
                print(f"Error in process_queue: {e}")

    def start_scheduler(self):
        """Start the scheduler to process the queue every second."""
        self.scheduler.add_job(self.process_queue, 'interval', seconds=1)
        self.scheduler.start()
        print("Queue Processor Scheduler started...")

    def stop_scheduler(self):
        """Stop the scheduler."""
        self.scheduler.shutdown()
        print("Queue Processor Scheduler stopped.")

# Example usage:
if __name__ == "__main__":
    queue_processor = QueueProcessor()
    queue_processor.start_scheduler()
    
    try:
        # Keep the script running to prevent the scheduler from shutting down
        while True:
            time.sleep(1)
    except (KeyboardInterrupt, SystemExit):
        # Safely stop the scheduler on exit
        queue_processor.stop_scheduler()
