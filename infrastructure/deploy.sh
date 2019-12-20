#!/bin/bash

set -e

export AWS_REGION=us-east-1

aws cloudformation package \
    --template-file=analytics.template.yml \
    --s3-bucket=prowe-deploy-bucket \
    --output-template-file analytics.transformed.yml

aws cloudformation deploy \
    --stack-name=sai-librarian-analytics-spike \
    --template-file=analytics.transformed.yml \
    --capabilities=CAPABILITY_IAM
