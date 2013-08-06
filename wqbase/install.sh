#!/bin/sh

HOST="devvm.spolo.org"
PORT=8080
if [ -n $1"" ]
then
 if [ $1 == "-h" ] || [ $1 == "--help" ] 
		then echo "Install/Update superpolo web bundle to sling."
		echo "USAGE: "
		echo "     install.sh [port] [host]"
		exit
 else
	PORT=$1
 fi
fi

if [ -n $2"" ]
then HOST=$2
fi

mvn -P autoInstallBundle clean install -Dsling.url=http://${HOST}:${PORT}/system/console
