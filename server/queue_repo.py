from models import QueueItem
from database import db
from app import app
class Queue:
    def __init__(self):
        pass

    def enqueue(self, data, monitor_id):
        """Add a new item to the queue"""
        new_item = QueueItem(data=data, monitor_id=monitor_id)
        db.session.add(new_item)
        db.session.commit()

    def dequeue(self):
        """Remove and return the oldest item in the queue"""
        # Select the oldest item
        item = db.session.query(QueueItem).order_by(QueueItem.inserted_at).with_for_update(skip_locked=True).first()

        if item:
            # Delete the item from the queue
            db.session.delete(item)
            db.session.commit()
            return item.data  # Return the dequeued data
        else:
            return None  # Queue is empty

    def queue_length(self):
        """Get the number of items in the queue"""
        return db.session.query(QueueItem).count()

    def view_queue(self):
        """View all items in the queue ordered by insertion time"""
        return db.session.query(QueueItem).order_by(QueueItem.inserted_at).all()

