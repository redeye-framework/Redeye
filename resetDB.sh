#!/bin/bash

rm RedDB/managementDB.db
rm RedDB/Projects/*
rm -rf files/*
python RedDB/db.py
