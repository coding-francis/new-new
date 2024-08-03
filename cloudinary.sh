#for file in coverage/*; do
#    cat @$file
#    curl -X POST https://api.cloudinary.com/v1_1/dxclgkewn/upload -u 637689312129337:-4OQwuT_71UjFXg4E7Xb_kW57Tw -F file=@$file -F upload_preset=ml_default -F folder=unit-test 
#done

#!/bin/bash

# Set your Cloudinary credentials
CLOUD_NAME="dxclgkewn"
API_KEY="637689312129337"
API_SECRET="-4OQwuT_71UjFXg4E7Xb_kW57Tw"
UPLOAD_PRESET="ml_default"  # Optional, if you have upload presets

# Directory containing the Jest coverage report
COVERAGE_DIR="coverage"
CLOUDINARY_FOLDER="coverage_report"

# Function to upload a file to Cloudinary

# Function to recursively upload all files in a directory
# Function to generate Cloudinary signature
generate_signature() {
  local cloudinary_folder=$1
  local timestamp=$2
  local upload_preset=$3

  if [ -z "$upload_preset" ]; then
    echo -n "folder=$cloudinary_folder&timestamp=$timestamp$API_SECRET" | sha1sum | awk '{print $1}'
  else
    echo -n "folder=$cloudinary_folder&timestamp=$timestamp&upload_preset=$upload_preset$API_SECRET" | sha1sum | awk '{print $1}'
  fi
}

# Function to generate Cloudinary signature
generate_signature() {
  local params=$1
  echo -n "$params$API_SECRET" | sha1sum | awk '{print $1}'
}

# Function to upload a file to Cloudinary
upload_file() {
  local file_path=$1
  local cloudinary_folder=$2

  file_name=$(basename "$file_path")
  public_id="$cloudinary_folder/$file_name"
  timestamp=$(date +%s)
  params="folder=$cloudinary_folder&public_id=$public_id&timestamp=$timestamp"
  
  if [ ! -z "$UPLOAD_PRESET" ]; then
    params="$params&upload_preset=$UPLOAD_PRESET"
  fi

  signature=$(generate_signature "$params")

  echo "Uploading $file_path as $public_id"

  response=$(curl -s -X POST "https://api.cloudinary.com/v1_1/$CLOUD_NAME/auto/upload" \
    -H "Content-Type: multipart/form-data" \
    -F "file=@$file_path" \
    -F "folder=$cloudinary_folder" \
    -F "public_id=$public_id" \
    -F "api_key=$API_KEY" \
    -F "timestamp=$timestamp" \
    -F "signature=$signature" \
    -F "upload_preset=$UPLOAD_PRESET")

  echo "Response: $response"
}

# Function to recursively upload all files in a directory
upload_directory() {
  local dir=$1
  local cloudinary_folder=$2

  for file in "$dir"/*; do
    if [[ -d $file ]]; then
      upload_directory "$file" "$cloudinary_folder/$(basename "$file")"
    else
      upload_file "$file" "$cloudinary_folder"
    fi
  done
}

# Upload the coverage directory
upload_directory "$COVERAGE_DIR" "$CLOUDINARY_FOLDER"

echo "All files uploaded successfully!"