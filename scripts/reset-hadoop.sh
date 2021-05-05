#!/bin/bash

# Require a hdfs path in $PATH variables and $HADOOP_HOME defined.
# kill $(sudo lsof -t -i:22)
# sudo apt-get remove openssh-client openssh-server
# sudo apt-get install openssh-client openssh-server
cd $HADOOP_HOME || exit

/bin/bash ./sbin/stop-all.sh || exit

hdfs namenode -format || exit

/bin/bash ./sbin/start-all.sh || exit

hdfs dfs -mkdir /scrapper || exit