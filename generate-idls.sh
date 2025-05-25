#!/bin/bash

# Create the destination directory if it doesn't exist
mkdir -p sdk/idl

# Copy the files to the destination directory
cp target/idl/cnft_fusion.json sdk/idl/
cp target/types/cnft_fusion.ts sdk/idl/

echo "Files copied successfully to sdk/idl/"