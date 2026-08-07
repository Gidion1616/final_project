#!/usr/bin/env python
import os, sys

if __name__ == "__main__":
    # Tumia settings za mradi huu kila mara ili environment ya mradi mwingine
    # isiingize DJANGO_SETTINGS_MODULE isiyo sahihi.
    os.environ["DJANGO_SETTINGS_MODULE"] = "config.settings"
    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)
