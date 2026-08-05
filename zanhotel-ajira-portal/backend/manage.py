#!/usr/bin/env python
import os,sys
if __name__=='__main__':
 # Always use this project's settings. This prevents an activated environment
 # from leaking DJANGO_SETTINGS_MODULE from another Django project.
 os.environ['DJANGO_SETTINGS_MODULE']='config.settings'; from django.core.management import execute_from_command_line; execute_from_command_line(sys.argv)
