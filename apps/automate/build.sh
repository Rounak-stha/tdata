#!/bin/bash

set -e  # Exit on error

echo "🔧 Enabling Corepack..."
corepack enable

echo "📦 Setting Yarn version to 4.5.3..."
yarn set version 4.5.3

echo "🏗️  Building shared package..."
yarn build:shared

echo "📥 Installing dependencies..."
yarn install

echo "🤖 Building automate package..."
yarn build:automate

echo "✅ Build complete!"
