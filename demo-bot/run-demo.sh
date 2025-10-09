#!/bin/bash

# StratusConnect Quote Loop System - Live Demo Runner
# This script sets up and runs the complete demonstration

echo "🚀 STRATUSCONNECT QUOTE LOOP SYSTEM - LIVE DEMO"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if the main project is running
echo "🔍 Checking if StratusConnect is running..."
if ! curl -s http://localhost:5173 > /dev/null; then
    echo "❌ StratusConnect is not running on localhost:5173"
    echo "   Please start the development server first:"
    echo "   npm run dev"
    exit 1
fi

echo "✅ StratusConnect is running"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing demo dependencies..."
    npm install
fi

# Create screenshots directory
mkdir -p demo-screenshots

echo ""
echo "🎯 Starting Quote Loop System Demo..."
echo "   This will demonstrate:"
echo "   • RFQ Creation by Broker"
echo "   • Quote Submission by Operator"
echo "   • Deal Acceptance with Payment"
echo "   • Crew Hiring with Commission"
echo "   • Real-time Updates across all terminals"
echo "   • Admin Monitoring and Analytics"
echo ""

# Run the demo
node quote-loop-demo.js

echo ""
echo "🎉 Demo completed! Check the demo-screenshots/ folder for results."



