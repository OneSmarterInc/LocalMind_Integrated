import os
import django

def run_in_background(document_id):
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    django.setup()
    
    from django.db import connection
    connection.close()

    from documents.views import run_document_processing
    run_document_processing(document_id)
